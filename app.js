var express = require('express');
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var request = require('request');
var app = express();
var path = require('path');

let port = 4000;
const SHEET = '10YOTLGf803jrAFnugIMZJWg9pOFBAA6NtXJhllLzj3I';

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, '/public/')));

app.get('/test', (req, res) => res.render('test') );

app.get('/sheet', function(req, res){
  
  fs.readFile('credentials.json',  (err, content) => {
    if(err) return (console.log('Error loading credentials', err));
    
    apiAuthorize(JSON.parse(content), handleApiPull);
  });
  
  function handleApiPull(auth) {
    const sheets = google.sheets({version: 'v4', auth});

    var result = sheets.spreadsheets.values.get({
      spreadsheetId: SHEET,
      range: 'A1:B10',
    }, (err, response) => {
      if (err) return console.log('The API returned an error: ' + err);
      
      const rows = response.data.values;
      
      res.render('sheet', {rows: rows})
    });
  }
});

app.get("/v4-get", function(req, res){
  
  // Authorization
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    apiAuthorize(JSON.parse(content), datapull);
  });
  
  // Callback function pulling data
  function datapull(auth) {
    
    const sheets = google.sheets({version: 'v4', auth});
    
    // Pulling the data from the specified spreadsheet and the specified range  
    var result = sheets.spreadsheets.values.get({
      spreadsheetId: '1UIV4RkOx8KJK2zQYig0klH5_f8FCOdwIWV8YF2VyF8I',
      range: 'tab2!A1:A10',
    }, (err, response)=>{
      if (err) return console.log('The API returned an error: ' + err);
      
      const rows = response.data.values;
      console.log(rows)
      // (4) Rendering the page and passing the rows data in
      res.render('test', {rows: rows})
    });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}!`))


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

/* @TODO export auth to module */
function apiAuthorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2( client_id, client_secret, redirect_uris[0] );
  
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}