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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const fileUploader_1 = require("../../helper/fileUploader");
const db_1 = require("../../config/db");
const AppError_1 = __importDefault(require("../../middlewares/AppError"));
const http_status_codes_1 = require("http-status-codes");
const paginationHelper_1 = require("../../helper/paginationHelper");
const campaign_constant_1 = require("./campaign.constant");
const createCampaign = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    let profilePhotoUrl;
    if (req.file) {
        const uploadResult = yield fileUploader_1.fileUploader.uploadToCloudinary(req.file);
        profilePhotoUrl = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    const newCampaign = yield db_1.prisma.campaign.create({
        data: {
            title: req.body.title,
            category: req.body.category,
            subcategory: req.body.subcategory,
            videoUrl: req.body.videoUrl,
            thumbnail: profilePhotoUrl ? profilePhotoUrl : "",
            views: req.body.views,
            dateLabel: req.body.dateLabel,
            duration: req.body.duration,
            brand: req.body.brand,
            featured: Boolean(req.body.featured),
            adminEmail: req.user.email,
        },
    });
    console.log(newCampaign);
    return newCampaign;
});
const getAllCampaignFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: campaign_constant_1.userSearchField.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    const whereConditions = andConditions.length > 0 ? {
        AND: andConditions
    } : {};
    const result = yield db_1.prisma.campaign.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = yield db_1.prisma.campaign.count({
        where: whereConditions
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const updateCampaignIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const campaignInfo = yield db_1.prisma.campaign.findUniqueOrThrow({
        where: {
            id,
        }
    });
    yield db_1.prisma.campaign.update({
        where: {
            id
        },
        data: payload
    });
    const responseData = yield db_1.prisma.campaign.findUnique({
        where: {
            id: campaignInfo.id
        }
    });
    return responseData;
});
const deleteCampaignFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const campaign = yield db_1.prisma.campaign.findUnique({
        where: { id }
    });
    if (!campaign) {
        throw new AppError_1.default(404, "Campaign not found");
    }
    const result = yield db_1.prisma.campaign.delete({ where: { id } });
    return result;
});
exports.CampaignService = {
    createCampaign,
    getAllCampaignFromDB,
    updateCampaignIntoDB,
    deleteCampaignFromDB
};
