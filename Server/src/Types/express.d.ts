
import { Request } from 'express';
import { CustomJwtPayload } from './jwt'; // Adjust the path as necessary

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
      file?: {
        path: string; // This matches what Multer provides
    };
    }
  }
}

 