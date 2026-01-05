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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookService = void 0;
const db_1 = require("../../config/db");
const enums_1 = require("../../../generated/prisma/enums");
const invoice_1 = require("../../utils/invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const handleStripeWebhookEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("🔔 Stripe event:", event.type);
    switch (event.type) {
        //  Do NOT update payment here
        case "checkout.session.completed": {
            console.log("Checkout completed (not payment confirmation)");
            break;
        }
        // ✅ UPDATE PAYMENT HERE
        case "payment_intent.succeeded": {
            const intent = event.data.object;
            const bookingId = (_a = intent.metadata) === null || _a === void 0 ? void 0 : _a.bookingId;
            const paymentId = (_b = intent.metadata) === null || _b === void 0 ? void 0 : _b.paymentId;
            if (!bookingId || !paymentId) {
                console.error("Missing metadata in PaymentIntent");
                return;
            }
            yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                yield tx.payment.update({
                    where: { id: paymentId },
                    data: {
                        status: enums_1.PaymentStatus.PAID,
                        // paymentGetWayData: intent,
                    },
                });
                yield tx.booking.update({
                    where: { id: bookingId },
                    data: {
                        status: enums_1.BookingStatus.CONFIRMED,
                    },
                });
            }));
            console.log("Payment marked PAID");
            break;
        }
        case "payment_intent.payment_failed": {
            console.log(" Payment failed");
            break;
        }
        default:
            console.log("Ignored event:", event.type);
    }
});
const makePaymentDone = (bookingId, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const payment = yield tx.payment.update({
            where: { id: paymentId },
            data: {
                status: enums_1.PaymentStatus.PAID,
            },
            include: {
                plan: true,
            },
        });
        const booking = yield tx.booking.update({
            where: { id: bookingId },
            data: {
                status: enums_1.BookingStatus.CONFIRMED,
            },
        });
        return { payment, booking };
    }));
    // invoice generation and email sending can be done here later 
    const invoiceData = {
        stripeSessionId: result.payment.stripeSessionId || result.payment.id,
        invoiceDate: result.payment.createdAt,
        bookingDate: result.booking.createdAt,
        fullName: result.payment.fullName || "Customer",
        customerEmail: result.payment.customerEmail,
        company: result.booking.company || "some thing went wong",
        phone: result.booking.phone || "some thing went wong",
        planName: result.payment.plan.name,
        amount: result.payment.amount, // if Stripe amount
        currency: result.payment.currency.toUpperCase(),
        bookingId: result.booking.id,
    };
    // Generate PDF
    const pdfBuffer = yield (0, invoice_1.generatePdf)(invoiceData);
    // Send Email
    yield (0, sendEmail_1.sendEmail)({
        to: invoiceData.customerEmail,
        subject: "Your Payment Invoice",
        templateName: "invoice",
        templateData: invoiceData,
        attachments: [
            {
                filename: "invoice.pdf",
                content: pdfBuffer,
                contentType: "application/pdf",
            },
        ],
    });
});
const donePayments = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield db_1.prisma.payment.findMany({
        where: {
            status: enums_1.PaymentStatus.PAID,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return payments;
});
const doneBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield db_1.prisma.booking.findMany({
        where: {
            status: enums_1.BookingStatus.CONFIRMED,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return bookings;
});
exports.StripeWebhookService = {
    handleStripeWebhookEvent,
    makePaymentDone,
    donePayments,
    doneBookings
};
