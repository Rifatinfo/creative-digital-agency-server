import Stripe from "stripe";
import AppError from "../../middlewares/AppError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/db";
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";


const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  console.log("🔔 Stripe event:", event.type);

  switch (event.type) {

    //  Do NOT update payment here
    case "checkout.session.completed": {
      console.log("Checkout completed (not payment confirmation)");
      break;
    }

    // ✅ UPDATE PAYMENT HERE
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;

      const bookingId = intent.metadata?.bookingId;
      const paymentId = intent.metadata?.paymentId;

      if (!bookingId || !paymentId) {
        console.error("Missing metadata in PaymentIntent");
        return;
      }

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: PaymentStatus.PAID,
            // paymentGetWayData: intent,
          },
        });

        await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: BookingStatus.CONFIRMED,
          },
        });
      });

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
};

const makePaymentDone = async (bookingId: string, paymentId: string) => {
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.PAID,
      },
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
      },
    });
  });
}

export const StripeWebhookService = {
  handleStripeWebhookEvent,
  makePaymentDone
};

