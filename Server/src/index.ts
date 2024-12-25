import express, { Request, Response , NextFunction} from 'express';
import cors from 'cors'
import connectDB from './db'
import path from 'path';
const app = express();
connectDB()
import dotenv from 'dotenv';

dotenv.config(); 


const corsOption:{origin:[string]} = {
    origin:['http://localhost:5173']
}
app.use(cors(corsOption))
app.use(express.json())

const port = process.env.PORT || 3000;

import userRoutes from './Routes/userRoute'

app.use('/',userRoutes)

import adminRouter from './Routes/adminRotes';

app.use('/admin',adminRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
      message: error.message || "Internal Server Error",
    });
  });
  
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});