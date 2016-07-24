// app.js

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var path = require('path');
var Session = require("express-session");
var _ = require('lodash');
var morgan = require('morgan');
var events = require('events');
eventEmitter = new events.EventEmitter();


var server = require('http').createServer(app);
io = require('socket.io')(server);


var api_router     = require('./routes/api');
var default_route  = require('./routes/default');
var config = require('./config');

var mongoDB_url = config.mongoDB_url;
var FileStore = require('session-file-store')(Session);
mongoose.connect(mongoDB_url);
session = Session(config.session);


app.use(express.static(path.join(__dirname, 'public')));

app.use(Session(config.session));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined'));
// app.use(morgan('dev'));


app.use('/api', api_router);
app.use('/', default_route);

// START THE SERVER
server.listen(config.server_port,config.server_ip_address, function () {
  console.log('Magic happens on port ' + config.server_port);
});

io.on('connection',function (socket) {
  console.log("New socket connected");

  var subscription = [];

  eventEmitter.on("restore subscription",function(data) {
    subscription = data.items;
  });
  eventEmitter.on("subscription added",function(data) {
    subscription.push(data.item);
  });
  eventEmitter.on("subscription removed",function(data) {
  _.pull(subscription,data.item);
  });
  eventEmitter.on("subscribe all",function(data) {
    subscription = data.items;
  });
  eventEmitter.on("unsubscribe all",function() {
    subscription = [];
  });

  eventEmitter.on('dbchange',function(data) {
    console.log(data);
    console.log("subscription.indexOf(data.item) > -1   " + subscription.indexOf(data.value) > -1);
    // if(subscription.indexOf(data.item) > -1)
      socket.emit('notification', data);
  })

});
