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
exports.BookingService = void 0;
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../../config/db");
const AppError_1 = __importDefault(require("../../middlewares/AppError"));
const uuid_1 = require("uuid");
const strip_1 = require("../../helper/strip");
const createBookingIntro = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the plan by UUID
    const plan = yield db_1.prisma.servicePlan.findUnique({
        where: { id: payload.planId },
    });
    if (!plan) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid plan selected");
    }
    const result = yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Create booking
        const booking = yield tx.booking.create({
            data: {
                fullName: payload.fullName,
                customerEmail: payload.customerEmail,
                company: payload.company,
                phone: payload.phone,
                projectDetails: payload.projectDetails,
                planId: payload.planId,
                // ...payload
            },
        });
        console.log(booking);
        const stripeSessionId = (0, uuid_1.v4)();
        const payment = yield tx.payment.create({
            data: {
                bookings: {
                    connect: {
                        id: booking.id
                    }
                },
                amount: plan.price,
                // status: "PENDING",
                stripeSessionId: stripeSessionId,
                currency: "BDT",
                customerEmail: payload.customerEmail,
                planId: payload.planId
            }
        });
        console.log(payment);
        const session = yield strip_1.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: payload.customerEmail,
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: `Booking with ${plan.name}`,
                        },
                        unit_amount: plan.price * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                paymentId: payment.id,
                bookingId: booking.id,
            },
            success_url: `http://localhost:3000/payment-success?bookingId=${booking.id}&paymentId=${payment.id}`,
            cancel_url: `http://localhost:3000`,
        });
        return {
            booking,
            payment,
            paymentUrl: session.url
        };
    }));
    return result;
});
const getCustomerOrderHistory = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.prisma.booking.findMany({
        where: { customerEmail: email },
        include: {
            plan: true,
            payment: {
                include: {
                    plan: {
                        select: {
                            serviceId: true,
                            ctaText: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
});
exports.BookingService = {
    createBookingIntro,
    getCustomerOrderHistory
};
