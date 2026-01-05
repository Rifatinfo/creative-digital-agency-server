"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouters = void 0;
const express_1 = require("express");
const fileUploader_1 = require("../../helper/fileUploader");
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const enums_1 = require("../../../generated/prisma/enums");
const router = (0, express_1.Router)();
router.post("/create-customer", fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createCustomerValidationSchema.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.createCustomer(req, res, next);
});
router.get("/", user_controller_1.UserController.getAllFromDB);
router.patch("/", (0, auth_1.default)(enums_1.UserRole.CLIENT, enums_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controller_1.UserController.updateMyProfile(req, res, next);
});
router.get("/me", (0, auth_1.default)(enums_1.UserRole.ADMIN), user_controller_1.UserController.getMyProfile);
router.patch('/:id/status', user_controller_1.UserController.changeProfileStatus);
// dashboard use
router.patch('/:id', user_controller_1.UserController.deleteFromDB);
router.get('/:id', user_controller_1.UserController.getByIdFromDB);
// hard delete
router.delete('/:id', user_controller_1.UserController.deleteHardFromDB);
exports.UserRouters = router;
