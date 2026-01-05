"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const jwthelper_1 = require("./jwthelper");
const AppError_1 = __importDefault(require("./AppError"));
const env_1 = require("../config/env");
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization || req.cookies.accessToken;
            console.log({ token }, "form auth guard");
            if (!token) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!!");
            }
            const verifiedUser = jwthelper_1.jwtHelper.verifyToken(token, env_1.envVars.JWT_SECRET);
            req.user = verifiedUser;
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Forbidden");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
};
exports.default = auth;
