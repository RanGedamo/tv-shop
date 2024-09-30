const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hash');
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    console.log('Password before encryption:', this.password);
    console.log('Encrypted password stored in DB:', hashedPassword);
    this.password = hashedPassword;
    next();
  } catch (err) {
    console.log('Error during password hashing:', err);
    next(err);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
