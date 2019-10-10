var express = require('express');
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var request = require('request');
var app = express();
var path = require('path');

var PAGEDATA = new Array;


let port = 4000;
const SHEET = '1gnstZzesgirR4BRwp_w897ncdamVrSm6Bmfy4J5_obA';      // expenses sheet
// const SHEET = '10YOTLGf803jrAFnugIMZJWg9pOFBAA6NtXJhllLzj3I';    // gsheets-db sheet


app.set('view engine', 'ejs');
app.set('json spaces', 2);
app.use('/public', express.static(path.join(__dirname, '/public/')));


app.get('/monthData/:mon', (req, res) => {
  let monthCode = req.mon;
  let month = [];
  if(PAGEDATA.length < 1) return res.json(month);
  
  for (let i = 0; i < 31; i++) {
    month.push( {x: i+1, y: PAGEDATA[0][i] + PAGEDATA[1][i] + PAGEDATA[2][i] + PAGEDATA[3][i] } );
  }
  res.json(month);

});


app.get('/data', (req, res) =>
  res.json(PAGEDATA)
);


app.get('/sheet', function(req, res){ /* -- GET /sheet ----------------*/
  // PAGEDATA = []; // Clear memory not to append but to overwrite with each req
  res.render('sheet', {PAGEDATA});

}); /* -------------------------------- end GET /sheet ----------------*/

function pullTransformedToNumeric(rowData){
  let numerics = [];
  rowData.forEach(element => {
    numerics.push(parseFloat(element[0].replace(/,/g, '.')));
  });
  PAGEDATA.push(numerics);
  return;
}



app.listen(port, function() { 
  console.log(`Listening on port ${port}!`);
  PAGEDATA = []; // Clear memory not to append but to overwrite with each req

  fs.readFile('credentials.json',  (err, content) => {
    if(err) return (console.log('Error loading credentials', err));
    console.log(1)
    apiAuthorize(JSON.parse(content), handleApiPull);
  });
  
  var compoundDataRanges = ["'2018+'!F399:F429", "'2018+'!I399:I429", "'2018+'!L399:L429", "'2018+'!O399:O429"];

  function handleApiPull(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    console.log(2)

    for(let dataRange of compoundDataRanges){
      sheets.spreadsheets.values.get( { spreadsheetId: SHEET, range: dataRange },
        function(err, response) {
          if (err) return console.log('The API returned an error: ' + err);
          console.log(3)
          const rows = response.data.values;
          pullTransformedToNumeric(rows)          
        }
      );
    }
  }
});



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