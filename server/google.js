import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

import moment from 'moment';

const SPREADSHEET_ID = '15GWYVCJnuSpHrB5T5eNYLlaHlxbrEFelh9i66xxpbFI';
const TRANSACTIONS_SHEET_ID = 1849364394;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.join(process.cwd(), './server/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './server/credentials.json');

var MENU = undefined;
var ACCOUNTS = undefined;
var DIMS = undefined;

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
      if (res.data.values !== undefined) {
        let values = res.data.values[0];
        while (values.length)
          ACCOUNTS.push(values.splice(0, 2)[0]);
      }
    }
    catch (err) {
      return Promise.reject("Unable to get accounts");
    }
  }
  return Promise.resolve(ACCOUNTS);
}

export async function formatColumn(auth, col) {
  let c0 = 2 * col;
  let c1 = 2 * col + 1;
  let c2 = 2 * col + 2;
  let requests = [
    {
      'updateBorders': {
        'range': {
          'sheetId': TRANSACTIONS_SHEET_ID,
          'startColumnIndex': c0,
          'endColumnIndex': c2
        },
        'left': {
          'style': 'SOLID_MEDIUM',
          'color': { 'red': 0, 'green': 0, 'blue': 0 },
        },
        'right': {
          'style': 'SOLID_MEDIUM',
          'color': { 'red': 0, 'green': 0, 'blue': 0 },
        },
      }
    },
    {
      'updateBorders': {
        'range': {
          'sheetId': TRANSACTIONS_SHEET_ID,
          'startRowIndex': 1,
          'endRowIndex': 3,
          'startColumnIndex': c0,
          'endColumnIndex': c2
        },
        'top': {
          'style': 'SOLID_MEDIUM',
          'color': { 'red': 0, 'green': 0, 'blue': 0 },
        },
        'bottom': {
          'style': 'SOLID_MEDIUM',
          'color': { 'red': 0, 'green': 0, 'blue': 0 },
        },
      }
    },
    {
      'mergeCells': {
        'range': {
          'sheetId': TRANSACTIONS_SHEET_ID,
          'startRowIndex': 0,
          'endRowIndex': 1,
          'startColumnIndex': c0,
          'endColumnIndex': c2
        },
        'mergeType': 'MERGE_ALL'
      }
    },
    {
      'repeatCell': {
        'range': {
          'sheetId': TRANSACTIONS_SHEET_ID,
          'startRowIndex': 2,
          'startColumnIndex': c0,
          'endColumnIndex': c1
        },
        'cell': {
          'userEnteredFormat': {
            'verticalAlignment': 'TOP'
          }
        },
        'fields': 'userEnteredFormat.numberFormat'
      }
    },
    {
      'repeatCell': {
        'range': {
          'sheetId': TRANSACTIONS_SHEET_ID,
          'startRowIndex': 2,
          'startColumnIndex': c1,
          'endColumnIndex': c2
        },
        'cell': {
          "userEnteredFormat": {
            'numberFormat': {
              'type': 'CURRENCY'
            }
          }
        },
        'fields': 'userEnteredFormat.numberFormat'
      }
    },
    {
      'addConditionalFormatRule': {
        'rule': {
          'ranges': [
            {
              'sheetId': TRANSACTIONS_SHEET_ID,
              'startRowIndex': 2,
              'startColumnIndex': c1,
              'endColumnIndex': c2
            },
          ],
          'booleanRule': {
            'condition': {
              'type': 'NUMBER_LESS',
              'values': [
                {
                  'userEnteredValue': '0'
                }
              ]
            },
            'format': {
              'backgroundColor': {
                'red': 0.71,
                'green': 0.84,
                'blue': 0.66
              }
            }
          }
        },
        'index': 0
      }
    },
    {
      'addConditionalFormatRule': {
        'rule': {
          'ranges': [
            {
              'sheetId': TRANSACTIONS_SHEET_ID,
              'startRowIndex': 2,
              'startColumnIndex': c1,
              'endColumnIndex': c2
            },
          ],
          'booleanRule': {
            'condition': {
              'type': 'NUMBER_GREATER',
              'values': [
                {
                  'userEnteredValue': '0'
                }
              ]
            },
            'format': {
              'backgroundColor': {
                'red': 0.96,
                'green': 0.78,
                'blue': 0.765
              }
            }
          }
        },
        'index': 1
      }
    },
  ];
  const sheets = google.sheets({ version: 'v4', auth });
  return sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: { requests: requests }
  }).then((res) => {
    return Promise.resolve(0);
  }).catch((err) => {
    return Promise.reject("Failed to format column");
  });
}
async function createColumn(auth, col, email) {
  return getTransactionsDims(auth).then(async (res) => {
    if (res[1] < col * 2 + 2) {
      try {
        await insertColumn(auth, 2);
      }
      catch (err) {
        return Promoise.reject(err);
      }
    }
    return formatColumn(auth, col).then((res) => {
      const sheets = google.sheets({ version: 'v4', auth });
      let c0 = 2 * col;
      let c1 = 2 * col + 1;
      let c2 = 2 * col + 2;
      return sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Transactions!R1C${c0 + 1}:R3C${c2}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[email, ''], ['# of Transactions', 'Debt'], [`=COUNTA(INDIRECT(\"R4C${c1}:C${c1}\",FALSE))`, `=SUM(INDIRECT(\"R4C${c2}:C${c2}\",FALSE))`]] }
      }).catch((err) => {
        return Promise.reject("Failed to write new column");
      });
    }).catch((err) => {
      return Promise.reject(err);
    });
  });
}
export async function getAccountInfo(auth, email) {
  try { await getAccounts(auth); } catch (err) { return Promise.reject(err); }

  let index = ACCOUNTS.indexOf(email);
  if (index === -1) {
    try {
      await createColumn(auth, ACCOUNTS.length, email);
    }
    catch (err) {
      return Promise.reject(err);
    }
    ACCOUNTS.push(email);
    return Promise.resolve({ email: email, debt: '$0.00', transactionCount: 0, index: ACCOUNTS.length-1 });
  } else {
    const sheets = google.sheets({ version: 'v4', auth });
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `Transactions!R${1}C${2 * index + 1}:R${3}C${2 * index + 2}`,
        majorDimension: 'ROWS',
      });
      let values = res.data.values;
      return Promise.resolve({ email: values[0][0], debt: values[2][1], transactionCount: values[2][0], index: index });
    }
    catch (err) {
      return Promise.reject("Unable to get account info");
    }
  }
}

async function resizeColumn(auth, col) {
  const sheets = google.sheets({ version: 'v4', auth });
  return sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: [
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: TRANSACTIONS_SHEET_ID,
              dimension: 'COLUMNS',
              startIndex: 2 * col,
              endIndex: 2 * col + 1
            }
          }
        }
      ]
    }
  }).then((res) => {
    return Promise.resolve(0);
  }).catch((err) => {
    return Promise.reject("Failed to resize column");
  });
}
async function getTransactionsDims(auth) {
  if (DIMS === undefined) {
    const sheets = google.sheets({ version: 'v4', auth });
    return sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID }).then((res) => {
      for (let i in res.data.sheets) {
        if (res.data.sheets[i].properties.sheetId == TRANSACTIONS_SHEET_ID)
          return Promise.resolve([res.data.sheets[i].properties.gridProperties.rowCount, res.data.sheets[i].properties.gridProperties.columnCount]);
      }
      return Promise.reject("Failed to find Transactions sheet");
    }).catch((err) => {
      return Promise.reject("Failed to get sheet dimensions");
    });
  }
  return Promise.resolve(DIMS);
}
async function insertColumn(auth, count) {
  const sheets = google.sheets({ version: 'v4', auth });
  return sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: [
        {
          appendDimension: {
            sheetId: TRANSACTIONS_SHEET_ID,
            dimension: 'COLUMNS',
            length: count
          }
        }
      ]
    }
  }).then((res) => {
    return Promise.resolve(0);
  }).catch((err) => {
    return Promise.reject("Failed to insert columns");
  });
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
    ret['order_number'] = id.toString().padStart(9, '0');
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
        resizeColumn(auth, Math.floor(c/2)).catch((err) => console.log(err));
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