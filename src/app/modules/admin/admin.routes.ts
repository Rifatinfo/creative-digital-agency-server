import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./admin.validation";
import { UserController } from "./admin.controller";

const router = Router();
router.post("/create-admin",   fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createAdmin(req, res, next)
    });


export const AdminRouters = router;