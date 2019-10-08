var express = require("express");
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var request = require('request');
var app = express();
var path = require('path');

let port = 4000;

app.set("view engine", "ejs");
// app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, '/public/')));

app.get("/test", function(req, res){
  res.render('test');
});


app.listen(port, () => console.log(`Listening on port ${port}!`))