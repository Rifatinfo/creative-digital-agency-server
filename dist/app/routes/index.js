"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const campaign_routes_1 = require("../modules/campaign/campaign.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const service_route_1 = require("../modules/service/service.route");
const servicePlan_route_1 = require("../modules/servicePlan/servicePlan.route");
const booking_routes_1 = require("../modules/booking/booking.routes");
const payment_route_1 = require("../modules/payment/payment.route");
const meta_routes_1 = require("../modules/meta/meta.routes");
exports.router = (0, express_1.Router)();
const moduleRouters = [
    {
        path: "/user",
        route: user_routes_1.UserRouters
    },
    {
        path: "/admin",
        route: admin_routes_1.AdminRouters
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRouters
    },
    {
        path: "/campaign",
        route: campaign_routes_1.CampaignRouters
    },
    {
        path: "/service",
        route: service_route_1.ServiceRoutes
    },
    {
        path: "/servicePlan",
        route: servicePlan_route_1.ServicePlanRoutes
    },
    {
        path: "/booking",
        route: booking_routes_1.BookingRouter
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoute
    },
    {
        path: "/meta",
        route: meta_routes_1.MetaRoutes
    },
];
moduleRouters.forEach((route) => {
    exports.router.use(route.path, route.route);
});
