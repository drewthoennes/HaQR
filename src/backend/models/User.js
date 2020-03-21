const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  github: {
    username: {
      type: String,
      unique: true
    },
    email: {
      type: String
    }
  },
  role: {
    type: String,
    enum: ['member', 'admin', 'owner'],
    required: true,
    default: 'member'
  },
  authorized: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  collection: 'users',
  versionKey: false,
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
