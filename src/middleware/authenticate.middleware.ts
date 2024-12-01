import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
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
}
