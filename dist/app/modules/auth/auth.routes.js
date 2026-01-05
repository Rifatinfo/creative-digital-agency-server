"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouters = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const enums_1 = require("../../../generated/prisma/enums");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.AuthController.login);
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
router.post("/logout", auth_controller_1.AuthController.logout);
router.post("/change-password", (0, auth_1.default)(enums_1.UserRole.ADMIN, enums_1.UserRole.CLIENT), auth_controller_1.AuthController.changePassword);
router.post("/forgot-password", auth_controller_1.AuthController.forgotPassword);
router.post('/reset-password', auth_controller_1.AuthController.resetPassword);
exports.AuthRouters = router;
