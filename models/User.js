const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {type:String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: {type: String, default: ''},
    profilePicture: {type: String, default: ''},
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
    isAdmin: { type:Boolean, default: false},
    isBanned: { type:Boolean, default: false},
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notifications' }],
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);