const express = require('express'),
bodyParser = require('body-parser'),
app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));

// index (homepage)
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// update list of users (this is hit when someone clicks a button on the page.)
var users = [];
app.post('/updateUser', function(request, response) {
  console.log('updateUser was hit by: ' + JSON.stringify(request.body));
  users.push(request.body);
});

app.get('/poll', function(request, response) {
  console.log('poll was hit by: ' + JSON.stringify(request.body));
  console.log('users is: ' + users);
  response.send(users);
});
