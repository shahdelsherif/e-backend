// src/types/express.d.ts
import { User } from './user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
