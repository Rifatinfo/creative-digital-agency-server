import Stripe from "stripe";
import { envVars } from "../config/env";

export const stripe = new Stripe(envVars.stripeSecretKey as string);