//models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema = new Schema({
  name:  String,
  date:  Number,
  tags: { type: [String], index: false}
});

module.exports = mongoose.model('Item', ItemSchema);