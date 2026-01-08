import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
// import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create-customer", fileUploader.upload.single("file"),
(req : Request, res : Response, next : NextFunction) => {
    req.body = UserValidation.createCustomerValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.createCustomer(req, res , next)
});

router.get( "/",  UserController.getAllFromDB);


router.patch("/", auth(UserRole.CLIENT, UserRole.ADMIN), fileUploader.upload.single('file'), (req : Request, res : Response, next : NextFunction) => {
    req.body = JSON.parse(req.body.data)
    return UserController.updateMyProfile(req, res, next)
});
router.get("/me",auth(UserRole.ADMIN) ,UserController.getMyProfile);
router.patch('/:id/status', UserController.changeProfileStatus);

// dashboard use
router.patch(
    '/:id',
    UserController.deleteFromDB
);

router.get(
    '/:id',
    UserController.getByIdFromDB
);

// hard delete
router.delete(
    '/:id',
    UserController.deleteHardFromDB
);

export const UserRouters = router;