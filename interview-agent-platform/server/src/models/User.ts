import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { IUser } from '../types';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: String,
    avatar: String,
    targetPosition: String,
    targetCompanies: [String],
    skills: [String],
    experience: Number,
  },
  { timestamps: true }
);

// 密码加密中间件
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 密码比对方法
userSchema.methods.comparePassword = async function (password: string) {
  return bcryptjs.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);
