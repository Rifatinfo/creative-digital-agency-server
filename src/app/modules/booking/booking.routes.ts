import { Router } from "express";
import { BookingController } from "./booking.controller";

const router = Router();

router.post("/create", BookingController.createBooking)

export const BookingRouter =  router ;