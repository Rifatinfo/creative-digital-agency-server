import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../middlewares/catchAsync"
import { sendResponse } from "../../middlewares/sendResponse";
import { BookingService } from "./booking.service"
import {  Request, Response } from "express";

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

export const BookingController = {
  createBooking
}