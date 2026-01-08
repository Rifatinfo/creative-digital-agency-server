import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { router } from './app/routes';
import { StatusCodes } from 'http-status-codes';


const app: Application = express();
app.use(cookieParser());



app.use(cors({
    origin: ['https://creative-digital-agency-client.vercel.app'],
    credentials: true
}));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Colourrose Backend is running successfully!"
    })
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