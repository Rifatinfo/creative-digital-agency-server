import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes";
import { jwtHelper } from "./jwthelper";
import AppError from "./AppError";

const auth = (...roles : string[]) => {
    return async (req : Request & {user?: any}, res : Response, next : NextFunction) => {
        try {
           const token = req.headers.authorization || req.cookies.accessToken;
           console.log({token}, "form auth guard");
           
           if(!token){
              throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!!")
           }

           const verifiedUser = jwtHelper.verifyToken(token, "abcd");
           req.user = verifiedUser;

           if(roles.length && !roles.includes(verifiedUser.role)){
               throw new AppError(StatusCodes.FORBIDDEN, "Forbidden");
           }
           next();
        } catch(err) {
            next(err);
        }
    }
} 

export default auth;