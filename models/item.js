//models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema = new Schema({
  title:  String,
  body:   String,
  date: { type: Date, default: Date.now },
  tags: { type: [String], index: false}
});

module.exports = mongoose.model('Item', ItemSchema);