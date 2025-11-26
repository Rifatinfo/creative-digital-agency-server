import { Server } from 'http';
import app from './app';
import { envVars } from './app/config/env';


let server: Server;

async function connectToDB(){
    try{
    //    await prisma.$connect();
       console.log("*** DB connection successfully ***");
    }catch(error){
       console.log("*** DB connection failed");
       process.exit(1);
    }
    
}

const startServer = async () => {
    try {
        await connectToDB();
        server = app.listen(envVars.PORT, () => {
            console.log("Server is Running");
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();

process.on("SIGTERM", () => {
    console.log("SIGTERM single received detected ... Server shut down");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal received detected... Server shut down");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("unhandledRejection", () => {
    console.log("UnHandle Rejection detected... Server shut down");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("uncaughtException", () => {
    console.log("uncaughtException detected... Server shut down");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})