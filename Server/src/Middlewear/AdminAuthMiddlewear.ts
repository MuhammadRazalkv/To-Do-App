import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}


export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token){ 
        res.status(401).json({ error: 'No token provided' });
        return
    }
    try {
      const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET as string) as {
        id: string;
        email: string;
        name: string;
      };
      req.user = decoded 
      next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid admin token' });
      return
    }
  };
  