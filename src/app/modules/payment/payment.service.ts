import Stripe from "stripe";
import AppError from "../../middlewares/AppError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/db";
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    switch(event.type){
      case "checkout.session.completed" : {
        const session = event.data.object as Stripe.Checkout.Session;

        const bookingId = session.metadata?.bookingId;
        const paymentId = session.metadata?.paymentId;
        console.log(bookingId, paymentId);
        
        if(!bookingId || !paymentId){
            throw new AppError(StatusCodes.BAD_REQUEST,"webhook missing bookingId or paymentId");
        }

        // Atomic update : payment + booking
        await prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where : {id : paymentId},
                data : {
                    status : session.payment_status === "unpaid" ? PaymentStatus.PAID : PaymentStatus.PENDING,
                    // paymentGetWayData : JSON.parse(JSON.stringify(session))
                }
            });
            await tx.booking.update({
                where : {id : bookingId},
                data : {
                    status : session.payment_status === "unpaid" ? BookingStatus.CONFIRMED : BookingStatus.PENDING
                }
            })
        });

         console.log(
          `✅ Stripe checkout completed for booking: ${bookingId}, payment: ${paymentId}`
        );
        break;
      }
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
}





export const StripeWebhookService = {
   handleStripeWebhookEvent
};

