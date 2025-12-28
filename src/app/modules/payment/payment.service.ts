import Stripe from "stripe";
import AppError from "../../middlewares/AppError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/db";
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";
import { IInvoiceData } from "./payment.interface";
import { generatePdf } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";


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
  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.PAID,
      },
      include: {
        plan: true,
      },
    });

    const booking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
      },
    });

    return { payment, booking };
  });




  // invoice generation and email sending can be done here later 
  const invoiceData: IInvoiceData = {
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
  const pdfBuffer = await generatePdf(invoiceData);

  // Send Email
  await sendEmail({
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
}


export const StripeWebhookService = {
  handleStripeWebhookEvent,
  makePaymentDone
};

