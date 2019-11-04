const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var InteractionSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['creation', 'modification', 'deletion', 'other'],
    required: true,
    default: 'other'
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  collection: 'interactions',
  versionKey: false,
  timestamps: true
});

module.exports = mongoose.model('Interaction', InteractionSchema);
