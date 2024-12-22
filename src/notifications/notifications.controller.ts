import { Controller, Get, Patch, Param, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Get all notifications for the logged-in user
  @Get()
  async getUserNotifications(@Req() req) {
    const userId = req.user.id; // Assuming you have user info in the request
    return this.notificationsService.getUserNotifications(userId);
  }

  // Mark a notification as read
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
