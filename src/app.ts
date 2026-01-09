import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { router } from './app/routes';
import { StatusCodes } from 'http-status-codes';


const app: Application = express();
app.use(cookieParser());


//parser
app.use(express.json());
app.use(cors({
    // origin: 'https://creative-digital-agency-client.vercel.app',
    origin: 'http://localhost:3000',
    credentials: true
}));

// Handle preflight requests for all routes
// app.options('*', cors());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Social Verb Backend is running successfully!"
    });
});

app.use('/api/v1', router);

// app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
})

export default app;