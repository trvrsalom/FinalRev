var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var challenge = {}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var jsonfile = require('jsonfile')
var util = require('util')

var ind = 0;

var file = 'crush.json'
jsonfile.readFile(file, function(err, obj) {
  challenge = obj
  console.log(challenge);
})

app.get('/term', function (req, res) {
  var tosend = {};
  var sending = 0;

  if(req.query.rand == "true" && req.query.spec == "true") {
    sending = Math.floor(Math.random()*challenge.terms.length)
    for(var i = 0; i < 100; i++) {
      if((challenge.terms[sending]["right"] || 0) > (challenge.terms[sending]["wrong"] || 0) + 2) {
        sending = Math.floor(Math.random()*challenge.terms.length)
        console.log("Upping");
      }
    }
  }
  else if(req.query.rand == 'true') {
    sending = Math.floor(Math.random()*challenge.terms.length)
  }
  else {
    sending = ind;
    ind++;
  }
  tosend = challenge.terms[sending];
  tosend["id"] = sending;
  res.json(tosend);
});

app.get('/term/:term', function (req, res) {
  var tosend = {};
  var sending = req.params.term;
  tosend = challenge.terms[sending];
  tosend["id"] = sending;
  res.json(tosend);
});

app.get('/term/:term/right', function(req, res) {
  console.log(req.params.term + " correct");
  challenge.terms[req.params.term]["right"] = (challenge.terms[req.params.term]["right"] || 0) + 1;
  jsonfile.writeFile(file, challenge, function (err) {
    //process.exit()
  })
  res.json(challenge.terms[req.params.term])

})

app.get('/kill', function(req, res) {
  jsonfile.writeFile(file, challenge, function (err) {
    //process.exit()
  })
})


app.get('/term/:term/wrong', function(req, res) {
  console.log(req.params.term + " incorrect");
  challenge.terms[req.params.term]["wrong"] = (challenge.terms[req.params.term]["wrong"] || 0) + 1;
  jsonfile.writeFile(file, challenge, function (err) {
    //process.exit()
  })
  res.json(challenge.terms[req.params.term])

})

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
