const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  isPublic: { type: Boolean, default: true },
  banner: { type: String,default:''},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  discussions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }],
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Community', communitySchema);
