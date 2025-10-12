const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  communityId: {type:mongoose.Schema.Types.ObjectId, ref:'Community', required:true },
  type: { type:String, required:true, enum: ['join','discussion']},
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notifications', notificationSchema);
