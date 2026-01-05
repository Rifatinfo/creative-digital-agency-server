"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignController = void 0;
const catchAsync_1 = require("../../middlewares/catchAsync");
const campaign_service_1 = require("./campaign.service");
const sendResponse_1 = require("../../middlewares/sendResponse");
const pick_1 = __importDefault(require("../../helper/pick"));
const campaign_constant_1 = require("./campaign.constant");
const AppError_1 = __importDefault(require("../../middlewares/AppError"));
const createCampaign = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_service_1.CampaignService.createCampaign(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created Successfully",
        data: result
    });
}));
const getAllCampaignFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, campaign_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield campaign_service_1.CampaignService.getAllCampaignFromDB(filter, options);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Campaign Data is retrieved Successfully",
        data: result
    });
}));
const updateCampaignIntoDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        throw new AppError_1.default(400, "Invalid campaign ID");
    }
    const result = yield campaign_service_1.CampaignService.updateCampaignIntoDB(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Campaign Data Updated Successfully",
        data: result
    });
}));
const deleteCampaignFromBD = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const result = yield campaign_service_1.CampaignService.deleteCampaignFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Campaign Delete Successfully",
        data: result
    });
}));
exports.CampaignController = {
    createCampaign,
    getAllCampaignFromDB,
    updateCampaignIntoDB,
    deleteCampaignFromBD
};
