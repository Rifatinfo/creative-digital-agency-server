import { Router } from "express";
import { BookingController } from "./booking.controller";


const router = Router();

router.post("/create", BookingController.createBooking)
router.get("/order-history",BookingController.getCustomerOrderHistory);

export const BookingRouter =  router ;

