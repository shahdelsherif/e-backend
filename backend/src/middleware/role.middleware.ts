import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../types/user.interface';

export function roleMiddleware(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
   /* const user = req.user; // Assume `req.user` is set by an earlier middleware
    if (!user || user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();*/
  };
}

/*@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private readonly allowedRoles: string[]) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // Skip role-based checks for public routes like '/users/admin'
    if (req.path === '/users/admin') {
      next();
      return;
    }

    const user: User = req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    next();
  }
}

// Factory function for creating role middleware
export function createRoleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip role-based checks for public routes like '/users/admin'
    if (req.path === '/users/admin') {
      next();
      return;
    }

    const user: User = req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    next();
  };
}*/
