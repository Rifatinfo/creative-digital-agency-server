"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRouter = void 0;
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const enums_1 = require("../../../generated/prisma/enums");
const router = (0, express_1.Router)();
router.post("/create", booking_controller_1.BookingController.createBooking);
router.get("/order-history", (0, auth_1.default)(enums_1.UserRole.CLIENT), booking_controller_1.BookingController.getCustomerOrderHistory);
exports.BookingRouter = router;
