import { Router } from "express";
import { UserRouters } from "../modules/user/user.routes";
import { AuthRouters } from "../modules/auth/auth.routes";
import { CampaignRouters } from "../modules/campaign/campaign.routes";
import { AdminRouters } from "../modules/admin/admin.routes";
import { ServiceRoutes } from "../modules/service/service.route";
import { ServicePlanRoutes } from "../modules/servicePlan/servicePlan.route";
import { BookingRouter } from "../modules/booking/booking.routes";
import { PaymentRoute } from "../modules/payment/payment.route";
import { MetaRoutes } from "../modules/meta/meta.routes";

export const router = Router();

const moduleRouters = [
    {
        path : "/user",
        route : UserRouters
    },
    {
        path : "/admin",
        route : AdminRouters
    },
    {
        path : "/auth",
        route : AuthRouters
    },
    {
        path : "/campaign",
        route : CampaignRouters
    },
    {
        path : "/service",
        route : ServiceRoutes
    },
    {
        path : "/servicePlan",
        route : ServicePlanRoutes
    },
    {
        path : "/booking",
        route : BookingRouter
    },
    {
        path : "/payment",
        route : PaymentRoute
    },
    {
        path : "/meta",
        route : MetaRoutes
    },
]

moduleRouters.forEach((route) => {
    router.use(route.path, route.route)
})

