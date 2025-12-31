import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./admin.validation";
import { UserController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";


const router = Router();
router.post("/create-admin", fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createAdmin(req, res, next)
    });

router.get(
    "/", 
    UserController.getAllFromDB
);

router.get(
    '/:id',
    UserController.getByIdFromDB
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN), 
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    return UserController.updateAdminProfileById(req, res, next);
  }
);


router.delete(
    '/:id',
    UserController.deleteFromDB
);

export const AdminRouters = router;
