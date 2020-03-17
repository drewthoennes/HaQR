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
  description: {
    type: String,
    default: ''
  },
  qr: {
    type: Number,
    unique: true,
    required: true
  },
  fields: [{
    _id: false,
    name: {
      type: String,
      required: true
    },
    attributes: [{
      _id: false,
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
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  collection: 'hackers',
  versionKey: false,
  timestamps: true
});

module.exports = mongoose.model('Hacker', HackerSchema);
