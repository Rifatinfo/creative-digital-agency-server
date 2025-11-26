import { Router } from "express";

export const router = Router();

const moduleRouters = [
    {
        path : "/user",
        // route : UserRoute
    },
]

moduleRouters.forEach((route) => {
    // router.use(route.path, route.route)
})

