import { Controller, Post, Get, Req, Res} from '@nestjs/common';
import { LogService } from './log.service';
import { Request, Response } from 'express';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  // Endpoint to log failed login attempts
  @Post('failed-login')
  async logFailedLogin(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      await this.logService.logFailedLogin(req.body);  // Log the failed login attempt
      return res.status(201).json({ message: 'Failed login attempt logged successfully' });
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error logging failed login attempt', 
        error: error || 'Unknown error' 
      });
    }
  }

  // Endpoint to log unauthorized API access attempts
  @Post('unauthorized-access')
  async logUnauthorizedAccess(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      await this.logService.logUnauthorizedAccess(req);  // Log the unauthorized access attempt
      return res.status(201).json({ message: 'Unauthorized access attempt logged successfully' });
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error logging unauthorized access attempt', 
        error: error || 'Unknown error' 
      });
    }
  }

  // Endpoint to retrieve logs for the admin dashboard
  @Get()
  async getLogs(@Res() res: Response): Promise<Response> {
    try {
      const logs = await this.logService.getLogs();  // Fetch all logs
      return res.status(200).json(logs);  // Send logs as a JSON response
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error fetching logs', 
        error: error || 'Unknown error' 
      });
    }
  }
}
