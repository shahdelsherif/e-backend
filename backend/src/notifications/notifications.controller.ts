import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // get notifiction for a certain user using access_token
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserNotifications(@Req() req) {
    const userId = req.user.userId; 
    return this.notificationsService.getUserNotifications(userId);
  }

  // mark as read
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
