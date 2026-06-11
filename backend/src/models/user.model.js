import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { SALT_ROUNDS } from '../config/config.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'User'], 
      default: 'User',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'], 
      default: 'Active',
    },
  },
  { timestamps: true }
);

// Hash password before saving to database
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  try {
    const salt = await bcryptjs.genSalt(SALT_ROUNDS);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (error) {
    throw(error);
  }
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;