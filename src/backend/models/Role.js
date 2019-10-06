const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var RoleSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  fields: [{
    name: {
      type: String,
      required: true
    },
    attributes: {
      type: Array,
      required: true
    }
  }]
}, {
  collection: 'roles'
});

module.exports = mongoose.model('Role', RoleSchema);
