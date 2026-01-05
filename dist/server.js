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
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const db_1 = require("./app/config/db");
let server;
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.prisma.$connect();
            console.log("*** DB connection successfully ***");
        }
        catch (error) {
            console.log("*** DB connection failed");
            process.exit(1);
        }
    });
}
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDB();
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log("Server is Running");
        });
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
process.on("SIGTERM", () => {
    console.log("SIGTERM single received detected ... Server shut down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("SIGINT signal received detected... Server shut down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("unhandledRejection", () => {
    console.log("UnHandle Rejection detected... Server shut down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", () => {
    console.log("uncaughtException detected... Server shut down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
