"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./app/routes");
const app = (0, express_1.default)();
// Middleware
// app.use(express.json()); 
// app.use(cors()); 
// app.use(compression()); 
// app.use(cookieParser());
// app.post(
//     "/api/v1/webhook",
//     express.raw({ type: "application/json" }),
//     StripeWebhookController.handleStripeWebhookEvent
// );
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// 3️⃣ Compress responses
app.use((0, compression_1.default)());
// 4️⃣ Parse JSON body
app.use(express_1.default.json());
app.use("/api/v1", routes_1.router);
// Default route for testing
app.get("/", (_req, res) => {
    res.send("API is running");
});
// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});
exports.default = app;
