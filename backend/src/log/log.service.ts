import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './log.schema';
import { Request } from 'express';

@Injectable()
export class LogService {
  constructor(@InjectModel('Log') private logModel: Model<Log>) {}

  // Log failed login attempts
  async logFailedLogin(user): Promise<void> {
    try {
        // Assuming `user` has `username` and `ipAddress`
        const log = new this.logModel({
            type: 'failed-login',
            message: `Failed login attempt for user: ${user.name}`,
            email: user.email,
        });
        await log.save();
    } catch (error) {
        throw new Error(`Error logging failed login: ${error}`);
    }
}

  // Log unauthorized API access attempts
  async logUnauthorizedAccess(req: Request): Promise<void> {
    try {
      const log = new this.logModel({
        type: 'unauthorized-access',
        message: `Unauthorized access attempt to API: ${req.originalUrl}`,
        email: req.ip,
      });
      await log.save();
    } catch (error) {
      throw new Error(`Error logging unauthorized access: ${error}`);
    }
  }

  // Retrieve logs (for the admin dashboard)
  async getLogs(): Promise<Log[]> {
    try {
      return await this.logModel.find().sort({ timestamp: -1 }).exec();
    } catch (error) {
      throw new Error(`Error fetching logs: ${error}`);
    }
  }
}
