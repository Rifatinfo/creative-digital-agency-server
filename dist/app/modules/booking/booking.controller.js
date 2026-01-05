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
exports.BookingController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = require("../../middlewares/catchAsync");
const sendResponse_1 = require("../../middlewares/sendResponse");
const booking_service_1 = require("./booking.service");
const AppError_1 = __importDefault(require("../../middlewares/AppError"));
const createBooking = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request body:", req.body); // check if it reaches here
    const result = yield booking_service_1.BookingService.createBookingIntro(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Plan booked successfully",
        data: result,
    });
}));
const getCustomerOrderHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //  email comes from token, not frontend
    const customerEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!customerEmail) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Customer email is not found");
    }
    const result = yield booking_service_1.BookingService.getCustomerOrderHistory(customerEmail);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Order history retrieved",
        data: result,
    });
}));
exports.BookingController = {
    createBooking,
    getCustomerOrderHistory
};
