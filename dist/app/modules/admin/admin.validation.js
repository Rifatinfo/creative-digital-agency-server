"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
// Validation schema for creating a student
const createAdminValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters long"),
    email: zod_1.z
        .email("Invalid email address"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long")
});
exports.UserValidation = {
    createAdminValidationSchema
};
