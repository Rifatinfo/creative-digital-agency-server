import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create-customer", fileUploader.upload.single("file"),
(req : Request, res : Response, next : NextFunction) => {
    req.body = UserValidation.createCustomerValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.createCustomer(req, res , next)
});

router.get(
    "/", auth(UserRole.ADMIN),
    UserController.getAllFromDB
)

router.patch("/update-my-profile", auth(UserRole.CLIENT, UserRole.ADMIN), fileUploader.upload.single('file'), (req : Request, res : Response, next : NextFunction) => {
    req.body = JSON.parse(req.body.data)
    return UserController.updateMyProfile(req, res, next)
});
router.get("/me",auth(UserRole.CLIENT, UserRole.ADMIN) ,UserController.getMyProfile);

export const UserRouters = router;