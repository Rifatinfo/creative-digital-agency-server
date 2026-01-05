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
exports.StripeWebhookController = void 0;
const catchAsync_1 = require("../../middlewares/catchAsync");
const strip_1 = require("../../helper/strip");
const payment_service_1 = require("./payment.service");
const sendResponse_1 = require("../../middlewares/sendResponse");
const AppError_1 = __importDefault(require("../../middlewares/AppError"));
const http_status_codes_1 = require("http-status-codes");
const handleStripeWebhookEvent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = "whsec_ebe417be94ae2fca74b84160133d99aca2420e8f5df2a2fcd9d2de117a80f65f";
    let event;
    try {
        event = strip_1.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error(" Webhook signature verification failed:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    const result = yield payment_service_1.StripeWebhookService.handleStripeWebhookEvent(event);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Webhook req send successfully',
        data: result,
    });
}));
const makePaymentDone = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, paymentId } = req.body;
    if (!bookingId || !paymentId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "BookingId and PaymentId are required");
    }
    const result = yield payment_service_1.StripeWebhookService.makePaymentDone(bookingId, paymentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Payment Completed and Booking Confirmed Successfully',
        data: result,
    });
}));
const donePayments = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.StripeWebhookService.donePayments();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Done Payments fetched successfully",
        data: result,
    });
}));
const doneBooking = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.StripeWebhookService.doneBookings();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Done Bookings fetched successfully",
        data: result,
    });
}));
exports.StripeWebhookController = {
    handleStripeWebhookEvent,
    makePaymentDone,
    donePayments,
    doneBooking
};
