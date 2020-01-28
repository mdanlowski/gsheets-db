var fs = require('fs');
var express = require('express');
var readline = require('readline');
var {google} = require('googleapis');
var request = require('request');
var app = express();
var path = require('path');

var PAGEDATA = new Array;


let port = 4000;
const SHEET = '1gnstZzesgirR4BRwp_w897ncdamVrSm6Bmfy4J5_obA';      // expenses sheet
// const SHEET = '10YOTLGf803jrAFnugIMZJWg9pOFBAA6NtXJhllLzj3I';    // gsheets-db sheet
var cherryPickedRanges = ["'2018+'!F399:F429", "'2018+'!I399:I429", "'2018+'!L399:L429", "'2018+'!O399:O429"];
var rectRanges = ["'2018+'!F399:O429"]//, "'2018+'!I399:I429", "'2018+'!L399:L429", "'2018+'!O399:O429"];
                        //  '2018+'!F434:O464
var monToMonDiff = 35;

app.set('view engine', 'ejs');
app.set('json spaces', 2);
app.use('/public', express.static(path.join(__dirname, '/public/')));

app.get('/monthData/:range', (req, res) => {
  let dataRange = req.params.range;
  let month = [];
  
  fs.readFile('credentials.json',  (err, content) => {
    if(err) return (console.log('Error loading credentials', err));
    console.log('connecting...');
    apiAuthorize(JSON.parse(content), handleApiPull);
  });

  function handleApiPull(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    console.log('authenticated')

    sheets.spreadsheets.values.get(
      { spreadsheetId: SHEET, range: dataRange },
      function(err, response) {
        if (err) return console.log('The API returned an error: ' + err);
        // console.log('pulling rect range');
        const rows = response.data.values;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.json(
          reduceToSums(filterAndToNum(rows))
        );
      }
    );
  }

  // res.json(month);

});

app.get('/data', (req, res) =>
  res.json(PAGEDATA)
);


app.get('/sheet', function(req, res){ /* -- GET /sheet ----------------*/
  // PAGEDATA = []; // Clear memory not to append but to overwrite with each req
  res.render('sheet', {PAGEDATA});

}); /* -------------------------------- end GET /sheet ----------------*/

function reduceToSums(data1x4) {
  let final = [];
  let total = 0;
  for (let i = 0; i < 31; i++){ //data1x4.length; i++) {
    if(data1x4[i] == undefined) break;
    let today = data1x4[i][0] + data1x4[i][1] + data1x4[i][2] + data1x4[i][3];
    total += today;
    final.push({ day: i+1, value: today, total: total })
  }
  return final;
}

function filterAndToNum(rowData) {
  // console.log('filtering descriptions...')
  // console.log(rowData)
  filtered = [];
  for (const row of rowData) {
    let col = new Array;
    for (let j3 = 0; j3 < 10; j3 += 3) {
      try {
        let num = parseFloat(row[j3].replace(/,/g, '.'));
        col.push( isNaN(num) ? 0 : num );
      }
      catch(error) {
        col.push(0)
      }
    }
    filtered.push(col);
  }
  // console.log(filtered)
  return filtered;
}


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
  // PAGEDATA = []; // Clear memory not to append but to overwrite with each req

  // fs.readFile('credentials.json',  (err, content) => {
  //   if(err) return (console.log('Error loading credentials', err));
  //   console.log(1)
  //   apiAuthorize(JSON.parse(content), handleApiPull);
  // });
  
  // var compoundDataRanges = ["'2018+'!F399:F429", "'2018+'!I399:I429", "'2018+'!L399:L429", "'2018+'!O399:O429"];

  // function handleApiPull(auth) {
  //   const sheets = google.sheets({version: 'v4', auth});
  //   console.log(2)

  //   for(let dataRange of compoundDataRanges){
  //     sheets.spreadsheets.values.get( { spreadsheetId: SHEET, range: dataRange },
  //       function(err, response) {
  //         if (err) return console.log('The API returned an error: ' + err);
  //         console.log(3)
  //         const rows = response.data.values;
  //         pullTransformedToNumeric(rows)          
  //       }
  //     );
  //   }
  // }
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