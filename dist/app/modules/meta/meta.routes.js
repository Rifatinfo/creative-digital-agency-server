"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const enums_1 = require("../../../generated/prisma/enums");
const meta_controller_1 = require("./meta.controller");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(enums_1.UserRole.ADMIN, enums_1.UserRole.CLIENT), meta_controller_1.MetaController.fetchDashboardMetaData);
exports.MetaRoutes = router;
