import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

import moment from 'moment';

const SPREADSHEET_ID = '15GWYVCJnuSpHrB5T5eNYLlaHlxbrEFelh9i66xxpbFI';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.join(process.cwd(), './server/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './server/credentials.json');

var MENU = undefined;
var ACCOUNTS = undefined;

function lcg(seed) {
  return (0x43FD43FD * seed + 0xC39EC3) & (0xFFFFFF);
}

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}
export async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

export async function refreshMenu(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Menu!B2:F',
      majorDimension: 'ROWS',
    });
    MENU = {
      tags: ["id", "name", "price", "category", "stock"], ids: res.data.values.map((entry) => entry[0]),
      values: res.data.values.reduce((map, obj) => {
        map[obj[0]] = obj;
        return map;
      }, {})
    };
  }
  catch (err) {
    return Promise.reject("Unable to get menu");
  }
}
export async function getMenu(auth) {
  if (MENU === undefined) {
    return refreshMenu(auth);
  }
  return Promise.resolve(MENU);
}

export async function getAccounts(auth) {
  if (ACCOUNTS === undefined) {
    const sheets = google.sheets({ version: 'v4', auth });
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Transactions!1:1',
        majorDimension: 'ROWS',
      });
      ACCOUNTS = [];
      let values = res.data.values[0];
      while (values.length)
        ACCOUNTS.push(values.splice(0, 2)[0]);
    }
    catch (err) {
      return Promise.reject("Unable to get accounts");
    }
  }
  return Promise.resolve(ACCOUNTS);
}

export async function getAccountInfo(auth, email) {
  try { await getAccounts(auth); } catch (err) { return Promise.reject(err); }

  let index = ACCOUNTS.indexOf(email);
  if (index === -1) {
    //ACCOUNTS.push(email);
    return Promise.resolve({});
  } else {
    const sheets = google.sheets({ version: 'v4', auth });
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `Transactions!R${1}C${2 * index + 1}:R${3}C${2 * index + 2}`,
        majorDimension: 'ROWS',
      });
      let values = res.data.values;
      return Promise.resolve({ email: values[0][0], name: values[1][0], debt: values[2][1], transactionCount: values[2][0], index: index });
    }
    catch (err) {
      return Promise.reject("Unable to get account info");
    }
  }
}

export async function writeTransaction(auth, transaction) {
  try { await getMenu(auth); } catch (err) { return Promise.reject(err); }

  try {
    const info = await getAccountInfo(auth, transaction.email);
    let ret = {};
    ret['time'] = moment().format('YYYY/MM/DD, HH:mm:ss');
    var total = 0;
    let receipt = ret['time'];
    for (let i in transaction.order) {
      let entry = transaction.order[i];
      let itemInfo = MENU.values[entry.id];
      if (itemInfo === -1)
        return Promise.reject(`Unable to find item of id ${entry.id}`);
      if (itemInfo[4] < entry.count)
        return Promise.reject(`Requested ${entry.count} of ${itemInfo[1]} but there is only ${itemInfo[4]} in stock`)
      receipt += `\n${itemInfo[1]} x${entry.count} at ${itemInfo[2]}`;
      total += parseFloat(itemInfo[2].slice(1), 10) * entry.count;
    }
    const sheets = google.sheets({ version: 'v4', auth });
    let r = parseInt(info.transactionCount, 10) + 4; let c = 2 * info.index + 1
    
    let id = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Extras!A2:A2',
      majorDimension: 'ROWS',
    });
    id = id.data.values[0][0];
    id = lcg(parseInt(id, 10));
    sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Extras!A2:A2',
      valueInputOption: 'RAW',
      resource: { values: [[id]] }
    });
    receipt = id.toString().padStart(9, '0') + "\n" + receipt;
    ret['order_number'] = id;
    ret['total'] = total;

    let request = {
      spreadsheetId: SPREADSHEET_ID,
      range: `Transactions!R${r}C${c}:R${r}C${c+1}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[receipt, total]] }
    };
    return sheets.spreadsheets.values.update(request).then((res) => {
      let data = [];
      transaction.order.forEach((entry) => {
        let itemInfo = MENU.values[entry.id];
        itemInfo[4] -= entry.count;
        data.push({ range: `Menu!F${MENU.ids.indexOf(entry.id) + 2}:F${MENU.ids.indexOf(entry.id) + 2}`, values: [[itemInfo[4]]] });
      });
      return sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        resource: { data: data, valueInputOption: 'RAW' }
      }).then((res) => {
        ret['finalDebt'] = parseFloat(info.debt.slice(1), 10) + total;
        return Promise.resolve(ret);
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => { return Promise.reject('Unable to complete transaction') });
  }
  catch (err) {
    return Promise.reject(err);
  }
}