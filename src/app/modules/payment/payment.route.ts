import { Router } from "express";
import { StripeWebhookController } from "./payment.controller";

const router = Router();

router.post("/payment-done", StripeWebhookController.makePaymentDone);

export const PaymentRoute = router;