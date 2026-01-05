"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
// env.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariable = () => {
    const requiredEnvVariable = ["PORT", "DATABASE_URL", "NODE_ENV", "CLOUDINARY_API_SECRET", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "STRIPE_SECRET_KEY", "SMTP_USER", "SMTP_PASS", "SMTP_PORT", "SMTP_HOST", "SMTP_FROM", "JWT_RESET_PASS_SECRET", "JWT_RESET_PASS_EXPIRES_IN", "RESET_PASS_LINK", "REFRESH_TOKEN_SECRET"];
    requiredEnvVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        stripeSecretKey: process.env.STRIPE_SECRET_KEY,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_FROM: process.env.SMTP_FROM,
        reset_pass_secret: process.env.JWT_RESET_PASS_SECRET,
        reset_pass_token_expires_in: process.env.JWT_RESET_PASS_EXPIRES_IN,
        reset_pass_link: process.env.RESET_PASS_LINK,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    };
};
exports.envVars = loadEnvVariable();
