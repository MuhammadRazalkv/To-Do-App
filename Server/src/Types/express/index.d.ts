import { Request } from 'express';

interface CustomJwtPayload {
  id: string;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload; // Extend the Request interface
    }
  }
}

