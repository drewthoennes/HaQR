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
  fields: {
    meals: [{
      name: {
        type: String,
        required: true
      },
      had: {
        type: Boolean,
        default: false
      }
    }],
    swag: [{
      name: {
        type: String,
        required: true
      },
      had: {
        type: Boolean,
        default: false
      }
    }]
  }
}, {
  collection: 'hackers'
});

module.exports = mongoose.model('Hacker', HackerSchema);
