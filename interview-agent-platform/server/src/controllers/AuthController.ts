import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  /**
   * 用户注册
   */
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Email, password and name are required',
        });
      }

      const { user, token } = await AuthService.register(email, password, name);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user, token },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * 用户登录
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const { user, token } = await AuthService.login(email, password);

      return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: { user, token },
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * 获取用户信息
   */
  static async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const user = await AuthService.getUserInfo(req.user.userId);

      return res.status(200).json({
        success: true,
        message: 'User profile retrieved',
        data: user,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * 更新用户信息
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const user = await AuthService.updateUserInfo(req.user.userId, req.body);

      return res.status(200).json({
        success: true,
        message: 'User profile updated',
        data: user,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
