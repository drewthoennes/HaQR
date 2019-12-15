const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ConfigSchema = new Schema({
    authorizeAll: {
        type: Boolean,
        default: false
    },
    promoteAll: {
        type: Boolean,
        default: false
    },
    activateOnCheckin: {
        type: Boolean,
        default: false
    },
    activeOnCreate: {
        type: Boolean,
        default: false
    }
}, {
  collection: 'config',
  versionKey: false,
  capped: true,
  size: 100000,
  max: 1
});

module.exports = mongoose.model('Config', ConfigSchema);
