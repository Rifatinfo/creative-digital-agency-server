import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode: number = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    let message = `Something Went Wrong !! ${err.message}`

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            message = "Duplicate key error",
            err = err.meta
            statusCode = StatusCodes.CONFLICT
        }
        if (err.code === "P1000"){
            message = "Authenticate failed against database server",
            err = err.meta
            statusCode = StatusCodes.BAD_REQUEST
        }
        if (err.code === "P2003"){
            message = "Foreign key constraint failed",
            err = err.meta
            statusCode = StatusCodes.BAD_REQUEST
        }
        
    } else if (err instanceof Prisma.PrismaClientValidationError) {
          message = "Validation Error",
          err = err.message,
          statusCode = StatusCodes.BAD_REQUEST
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
          message = "Unknown Prisma error occured!",
          err = err.message,
          statusCode = StatusCodes.BAD_REQUEST
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
          message = "Prisma client failed to initialize",
          err = err.message,
          statusCode = StatusCodes.BAD_REQUEST
    }
    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}