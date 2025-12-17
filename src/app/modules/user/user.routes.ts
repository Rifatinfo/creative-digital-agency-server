import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";
import { UserController } from "./user.controller";

const router = Router();

router.post("/create-customer", fileUploader.upload.single("file"),
(req : Request, res : Response, next : NextFunction) => {
    req.body = UserValidation.createCustomerValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.createCustomer(req, res , next)
});

router.get(
    "/", 
    UserController.getAllFromDB
)

export const UserRouters = router;