const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var HackerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  }
}, {
  collection: 'hackers'
});

module.exports = mongoose.model('Hacker', HackerSchema);
