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
exports.UserController = void 0;
const catchAsync_1 = require("../../middlewares/catchAsync");
const sendResponse_1 = require("../../middlewares/sendResponse");
const admin_service_1 = require("./admin.service");
const pick_1 = __importDefault(require("../../helper/pick"));
const user_constant_1 = require("../user/user.constant");
const http_status_codes_1 = require("http-status-codes");
const createAdmin = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Admin : ", req.body);
    const result = yield admin_service_1.UserService.createAdmin(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created Successfully",
        data: result
    });
}));
const getAllFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, user_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield admin_service_1.UserService.getAllFromDB(filter, options);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Admin retrieve Successfully",
        data: result
    });
}));
const updateAdminProfileById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.user;
    const adminId = req.params.id;
    const result = yield admin_service_1.UserService.updateAdminById(req, adminId, authUser);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin profile updated successfully",
        data: result,
    });
}));
const getByIdFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.UserService.getByIdFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin data fetched by id!",
        data: result
    });
}));
const deleteFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.UserService.deleteFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin data deleted!",
        data: result
    });
}));
exports.UserController = {
    createAdmin,
    getAllFromDB,
    updateAdminProfileById,
    getByIdFromDB,
    deleteFromDB
};
