import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { JWTPayload } from '../types';

export class AuthService {
  /**
   * 用户注册
   */
  static async register(email: string, password: string, name: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = this.generateToken((user._id as any).toString(), email);
    return { user: user.toObject(), token };
  }

  /**
   * 用户登录
   */
  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = this.generateToken((user._id as any).toString(), email);
    return { user: user.toObject(), token };
  }

  /**
   * 生成JWT令牌
   */
  static generateToken(userId: string, email: string): string {
    const payload: JWTPayload = { userId, email };
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expire } as any);
  }

  /**
   * 验证令牌
   */
  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
  }

  /**
   * 获取用户信息
   */
  static async getUserInfo(userId: string) {
    const user = await User.findById(userId).select('-password');
    return user?.toObject();
  }

  /**
   * 更新用户信息
   */
  static async updateUserInfo(userId: string, updateData: any) {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select(
      '-password'
    );
    return user?.toObject();
  }
}
