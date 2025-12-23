import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
// router.post("/forgot-password", AuthControllers.forgotPassword)

export const AuthRouters = router;
