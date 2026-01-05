"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignRouters = void 0;
const express_1 = require("express");
const fileUploader_1 = require("../../helper/fileUploader");
const campaign_validation_1 = require("./campaign.validation");
const campaign_controller_1 = require("./campaign.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const enums_1 = require("../../../generated/prisma/enums");
const router = (0, express_1.Router)();
router.post("/create-campaign", (0, auth_1.default)(enums_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = campaign_validation_1.CampaignValidation.campaignSchema.parse(JSON.parse(req.body.data));
    return campaign_controller_1.CampaignController.createCampaign(req, res, next);
});
router.get("/", campaign_controller_1.CampaignController.getAllCampaignFromDB);
router.patch("/:id", fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = campaign_validation_1.CampaignValidation.campaignSchema.parse(JSON.parse(req.body.data));
    return campaign_controller_1.CampaignController.updateCampaignIntoDB(req, res, next);
});
router.delete("/:id", campaign_controller_1.CampaignController.deleteCampaignFromBD);
exports.CampaignRouters = router;
