import { catchAsync } from "../../middlewares/catchAsync";
import { stripe } from "../../helper/strip";
import { StripeWebhookService } from "./payment.service";
import { sendResponse } from "../../middlewares/sendResponse";
import { Request, Response } from "express";
import AppError from "../../middlewares/AppError";
import { StatusCodes } from "http-status-codes";

const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {

    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = "whsec_ebe417be94ae2fca74b84160133d99aca2420e8f5df2a2fcd9d2de117a80f65f";

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        console.error(" Webhook signature verification failed:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    const result = await StripeWebhookService.handleStripeWebhookEvent(event);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Webhook req send successfully',
        data: result,
    });
});

const makePaymentDone = catchAsync(async (req: Request, res: Response) => {
    const { bookingId, paymentId } = req.body;
    if (!bookingId || !paymentId) {
        throw new AppError(StatusCodes.BAD_REQUEST, "BookingId and PaymentId are required");
    }
    const result = await StripeWebhookService.makePaymentDone(bookingId, paymentId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Payment Completed and Booking Confirmed Successfully',
        data: result,
    });
});

export const StripeWebhookController = {
    handleStripeWebhookEvent,
    makePaymentDone,
}

