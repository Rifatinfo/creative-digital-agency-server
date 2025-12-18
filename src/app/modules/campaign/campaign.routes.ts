import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { CampaignValidation } from "./campaign.validation";
import { CampaignController } from "./campaign.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create-campaign", auth(UserRole.ADMIN), fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = CampaignValidation.campaignSchema.parse(JSON.parse(req.body.data))
        return CampaignController.createCampaign(req, res, next)
    });

router.get("/", CampaignController.getAllCampaignFromDB);
router.patch("/:id",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = CampaignValidation.campaignSchema.parse(JSON.parse(req.body.data))
        return CampaignController.updateCampaignIntoDB(req, res, next)
    }
);
router.delete("/:id", CampaignController.deleteCampaignFromBD);
export const CampaignRouters = router;

