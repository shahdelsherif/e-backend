import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../types/user.interface'; // Ensure this matches your actual `User` interface

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private readonly allowedRoles: string[]) {}

  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Ensure the user's roles include at least one of the allowed roles
    if (!user.roles || !user.roles.some((role) => this.allowedRoles.includes(role))) {
      throw new ForbiddenException('Access denied');
    }

    next();
  }
}

// Factory function
export function createRoleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Ensure the user's roles include at least one of the allowed roles
    if (!user.roles || !user.roles.some((role) => allowedRoles.includes(role))) {
      throw new ForbiddenException('Access denied');
    }

    next();
  };
}




/*import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../types/user.interface';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private readonly allowedRoles: string[]) {}

  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user; // TypeScript now knows user exists and has the `User` type

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    next();
  }
}

// Factory function
export function createRoleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    next();
  };
}*/
