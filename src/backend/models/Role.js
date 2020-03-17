const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var RoleSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  fields: [{
    _id: false,
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
  collection: 'roles',
  versionKey: false,
  timestamps: true
});

module.exports = mongoose.model('Role', RoleSchema);
