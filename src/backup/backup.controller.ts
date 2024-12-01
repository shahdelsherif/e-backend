/*// src/backup/backup.controller.ts
import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('backup')  // The route for backup operations
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  // Endpoint to trigger backup manually
  @Post()
  @HttpCode(HttpStatus.OK)  // Ensure it responds with status 200
  async triggerBackup() {
    try {
      console.log('Triggering backup manually...');
      await this.backupService.handleCron();  // Manually invoke the cron job logic
      return { message: 'Backup triggered successfully!' };
    } catch (error) {
      console.error('Error triggering backup:', error);
      return { message: 'Error triggering backup.', error: error.message };
    }
  }
}
*/



/*// src/backup/backup.controller.ts
import { Controller, Post } from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('backup')  // The route for the backup operations
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  // Endpoint to trigger backup manually
  @Post()
  async triggerBackup() {
    try {
      console.log('Triggering backup manually...');
      await this.backupService.handleCron();  // Manually invoke the cron job logic
      return { message: 'Backup triggered successfully!' };
    } catch (error) {
      console.error('Error triggering backup:', error);
      return { message: 'Error triggering backup.' };
    }
  }
}
*/



/*// src/backup/backup.controller.ts
import { Controller, Post } from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  // Endpoint to trigger the backup manually
  @Post()
  async triggerBackup() {
    try {
      await this.backupService.triggerBackup();  // Ensure to await the async method
      return { message: 'Backup triggered successfully!' };
    } catch (error) {
      console.error('Error triggering backup:', error);
      return { message: 'Error triggering backup.' };
    }
  }
}
*/