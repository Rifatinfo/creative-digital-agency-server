"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("../../generated/prisma/client");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let message = `Something Went Wrong !! ${err.message}`;
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            message = "Duplicate key error",
                err = err.meta;
            statusCode = http_status_codes_1.StatusCodes.CONFLICT;
        }
        if (err.code === "P1000") {
            message = "Authenticate failed against database server",
                err = err.meta;
            statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        }
        if (err.code === "P2003") {
            message = "Foreign key constraint failed",
                err = err.meta;
            statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        }
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        message = "Validation Error",
            err = err.message,
            statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        message = "Unknown Prisma error occured!",
            err = err.message,
            statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    else if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        message = "Prisma client failed to initialize",
            err = err.message,
            statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: env_1.envVars.NODE_ENV === 'development' ? err.stack : null
    });
};
exports.globalErrorHandler = globalErrorHandler;
