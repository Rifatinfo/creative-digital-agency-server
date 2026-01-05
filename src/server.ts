// server.ts
import app from "./app";
import { prisma } from "./app/config/db";

let isConnected = false;

async function connectToDB() {
  if (isConnected) return;
  await prisma.$connect();
  isConnected = true;
  console.log("✅ DB connected");
}

export default async function handler(req: any, res: any) {
  await connectToDB();
  return app(req, res); // Vercel serverless expects a function
}



// process.on("SIGTERM", () => {
//     console.log("SIGTERM single received detected ... Server shut down");
//     if (server) {
//         server.close(() => {
//             process.exit(1)
//         })
//     }
//     process.exit(1)
// })

// process.on("SIGINT", () => {
//     console.log("SIGINT signal received detected... Server shut down");

//     if (server) {
//         server.close(() => {
//             process.exit(1)
//         })
//     }
//     process.exit(1)
// })

// process.on("unhandledRejection", () => {
//     console.log("UnHandle Rejection detected... Server shut down");

//     if (server) {
//         server.close(() => {
//             process.exit(1)
//         })
//     }
//     process.exit(1)
// })
// process.on("uncaughtException", () => {
//     console.log("uncaughtException detected... Server shut down");

//     if (server) {
//         server.close(() => {
//             process.exit(1)
//         })
//     }
//     process.exit(1)
// })