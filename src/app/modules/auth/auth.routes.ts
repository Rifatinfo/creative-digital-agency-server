import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/change-password", auth(UserRole.ADMIN, UserRole.CLIENT), AuthController.changePassword);
router.post( "/forgot-password", AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);


export const AuthRouters = router;
