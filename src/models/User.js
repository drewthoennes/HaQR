const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  github: {
    username: {
      type: String
    },
    email: {
      type: String
    }
  }
}, {
  collection: 'users'
});

module.exports = mongoose.model('User', UserSchema);
