import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import {NotificationsGateway} from './notifications.geteway'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createNotification(
    recipientId: string,
    message: string,
    forumId?: string,
    postId?: string,
  ): Promise<Notification> {
    const notification = new this.notificationModel({
      recipientId,
      message,
      forumId,
      postId,
    });
    await notification.save();

    // Notify user in real-time
    this.notificationsGateway.notifyUser(recipientId, message);

    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ recipientId: userId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
  }
}
