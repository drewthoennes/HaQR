const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var HackerSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  qr: {
    type: Number,
    unique: true,
    required: true
  },
  fields: [{
    name: {
      type: String,
      required: true
    },
    attributes: [{
      name: {
        type: String,
        required: true
      },
      had: {
        type: Boolean,
        default: false
      }
    }]
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  collection: 'hackers',
  versionKey: false
});

module.exports = mongoose.model('Hacker', HackerSchema);
