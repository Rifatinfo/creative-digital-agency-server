// env.ts
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    PORT: string,
    DATABASE_URL: string,
    NODE_ENV: string,
    api_secret: string,
    cloud_name: string,
    api_key: string,
    stripeSecretKey: string,
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_PORT: string;
    SMTP_HOST: string;
    SMTP_FROM: string;
}

const loadEnvVariable = (): EnvConfig => {
    const requiredEnvVariable: string[] = ["PORT", "DATABASE_URL", "NODE_ENV", "CLOUDINARY_API_SECRET", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "STRIPE_SECRET_KEY", "SMTP_USER", "SMTP_PASS", "SMTP_PORT", "SMTP_HOST", "SMTP_FROM"]

    requiredEnvVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`)
        }
    })


    return {
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        NODE_ENV: process.env.NODE_ENV as string,
        api_secret: process.env.CLOUDINARY_API_SECRET as string,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
        api_key: process.env.CLOUDINARY_API_KEY as string,
        stripeSecretKey: process.env.STRIPE_SECRET_KEY as string,
        SMTP_USER: process.env.SMTP_USER as string,
        SMTP_PASS: process.env.SMTP_PASS as string,
        SMTP_PORT: process.env.SMTP_PORT as string,
        SMTP_HOST: process.env.SMTP_HOST as string,
        SMTP_FROM: process.env.SMTP_FROM as string,
    }
}

export const envVars = loadEnvVariable();  