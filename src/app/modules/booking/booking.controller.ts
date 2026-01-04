import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../middlewares/catchAsync"
import { sendResponse } from "../../middlewares/sendResponse";
import { BookingService } from "./booking.service"
import {  Request, Response } from "express";
import AppError from "../../middlewares/AppError";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  console.log("Request body:", req.body); // check if it reaches here

  const result = await BookingService.createBookingIntro(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Plan booked successfully",
    data: result,
  });
});

const getCustomerOrderHistory = catchAsync( async (req: Request, res: Response) => {
    //  email comes from token, not frontend
    const customerEmail = req.user?.email;
   
    if (!customerEmail) {
       throw new AppError(StatusCodes.BAD_REQUEST, "Customer email is not found")
    }
    const result = await BookingService.getCustomerOrderHistory(customerEmail);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order history retrieved",
      data: result,
    });
  })

export const BookingController = {
  createBooking,
  getCustomerOrderHistory
}