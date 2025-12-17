// env.ts
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    PORT: string,
    DATABASE_URL: string,
    NODE_ENV: string,
    api_secret : string,
    cloud_name : string,
    api_key : string
}

const loadEnvVariable = (): EnvConfig => {
    const requiredEnvVariable: string[] = ["PORT", "DATABASE_URL", "NODE_ENV", "CLOUDINARY_API_SECRET", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY"]
    
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
        api_key: process.env.CLOUDINARY_API_KEY as string
    
    }
}

export const envVars = loadEnvVariable();  