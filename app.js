// app.js

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var path = require('path');
var Session = require("express-session");


var api_router     = require('./routes/api');
var default_route  = require('./routes/default');
var config = require('./config');



var port = process.env.PORT || 8080;
var mongoDB_url = 'mongodb://localhost:27017/social_cops';
var FileStore = require('session-file-store')(Session);
mongoose.connect(mongoDB_url);
session = Session(config.session);



app.use(express.static(path.join(__dirname, 'public')));

app.use(Session({
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(function printSession(req, res, next) {
  console.log('req.session:', req.session);
  return next();
});




app.use('/api', api_router);
app.use('/', default_route);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);