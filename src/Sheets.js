import { gapi, loadAuth2, loadClientAuth2 } from 'gapi-script';
import credentials from './credentials.json'

const SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';

export async function test() {
  const auth2 = await loadAuth2(gapi, credentials.web.client_id, SCOPE);
  let gapiClient = loadClientAuth2(gapi, credentials.web.client_id, SCOPE);
  console.log(auth2.isSignedIn.get())

  /*
  gapiClient.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  }).then((response) => {
    const result = response.result;
    const numRows = result.values ? result.values.length : 0;
    console.log(`${numRows} rows retrieved.`);
    if (callback) callback(response);
  });
  */

  /*gapi.load('auth2', () => {
    gapi.auth2.init({
      client_id: credentials.installed.client_id
    }).then(function () {
      var authInstance = gapi.auth2.getAuthInstance();
      authInstance.signIn().then(function () {
        var user = authInstance.currentUser.get();
        var accessToken = user.getAuthResponse().access_token;
        // Use the access token to authorize API requests
      });
    });
  });*/
}
