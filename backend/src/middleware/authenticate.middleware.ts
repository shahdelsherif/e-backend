import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogService } from '../log/log.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly logService: LogService,
    private readonly jwtService: JwtService
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // Skip authentication for specific routes like '/users/admin' or '/users/login'
    if (
      req.path === '/users/register' ||
      req.path === '/users/login' ||
      req.path === '/users/admin' // Skip authentication for '/users/admin' route
    ) {
      next();
      return;
    }

    const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Authorization' header

    if (!token) {
      res.status(401).json({ message: 'Unauthorized access, please provide a valid token.' });
      return;
    }

    try {
      const payload = this.jwtService.verify(token); // Verify JWT token
      req.user = payload; // Attach the user to the request object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}




/*import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../types/user.interface'; // Import the User interface

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as User; // Cast the decoded token to User
      req.user = decoded; // Attach user info to the request
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}*/