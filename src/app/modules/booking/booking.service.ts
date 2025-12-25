import { StatusCodes } from "http-status-codes"
import { prisma } from "../../config/db"
import AppError from "../../middlewares/AppError"
import { ICreateBookingPayload } from "./booking.interface"
import { v4 as uuidv4 } from 'uuid';
import { stripe } from "../../helper/strip";

const createBookingIntro = async (payload: ICreateBookingPayload) => {
  // Fetch the plan by UUID
  const plan = await prisma.servicePlan.findUnique({
    where: { id: payload.planId },
  });

  if (!plan) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid plan selected");
  }


  const result = await prisma.$transaction(async (tx) => {
    // Create booking
    const booking = await tx.booking.create({
      data: {
        // fullName: payload.fullName,
        // customerEmail: payload.customerEmail,
        // company: payload.company,
        // phone: payload.phone,
        // projectDetails: payload.projectDetails,
        // planId: payload.planId,
        ...payload
      },
    });
    console.log(booking);
    
    const stripeSessionId = uuidv4()
    const payment = await tx.payment.create({
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
    const session = await stripe.checkout.sessions.create({
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
   
      success_url: `https://www.programming-hero.com/payment-success?bookingId=${booking.id}&paymentId=${payment.id}`,
      cancel_url: `https://next.programming-hero.com/`,
    });

    return {
      booking,
      payment,
      paymentUrl: session.url
    }
  });
  return result;
}

const getCustomerOrderHistory = async (email: string) => {
  return prisma.booking.findMany({
    where: { customerEmail: email },
    include: {
      plan: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};


export const BookingService = {
  createBookingIntro,
  getCustomerOrderHistory
}