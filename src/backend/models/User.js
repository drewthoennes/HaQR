const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  github: {
    username: {
      type: String
    },
    email: {
      type: String
    }
  },
  role: {
    type: String,
    enum: ['member', 'organizer', 'admin'],
    required: true,
    default: 'member'
  }
}, {
  collection: 'users'
});

module.exports = mongoose.model('User', UserSchema);
