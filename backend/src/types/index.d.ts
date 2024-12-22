import { User } from './user.interface'; // Adjust the path as needed

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
