import { Router } from "express";
import { BookingController } from "./booking.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create", BookingController.createBooking)
router.get("/order-history", auth(UserRole.CLIENT),BookingController.getCustomerOrderHistory);

export const BookingRouter =  router ;

