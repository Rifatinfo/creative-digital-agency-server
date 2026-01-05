"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
// Validation schema for creating a customer 
const createCustomerValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters long"),
    email: zod_1.z
        .email("Invalid email address"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    phone: zod_1.z
        .string()
        .min(10, "Phone number must be at least 10 digits"),
    address: zod_1.z
        .string()
        .min(5, "Address must be at least 5 characters long"),
});
exports.UserValidation = {
    createCustomerValidationSchema
};
