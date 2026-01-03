import { Router } from "express";
import { StripeWebhookController } from "./payment.controller";

const router = Router();

router.post("/payment-done", StripeWebhookController.makePaymentDone);
router.get("/all-payments",  StripeWebhookController.donePayments);
router.get("/all-booking",StripeWebhookController.doneBooking);

export const PaymentRoute = router;