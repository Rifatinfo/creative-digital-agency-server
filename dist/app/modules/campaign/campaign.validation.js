"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignValidation = exports.campaignSchema = void 0;
const zod_1 = require("zod");
exports.campaignSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title is required"),
    category: zod_1.z.string().min(3, "Category is required"),
    subcategory: zod_1.z.string().min(3, "Subcategory is required"),
    thumbnail: zod_1.z.url().optional(),
    videoUrl: zod_1.z.url("Video URL must be a valid URL"),
    views: zod_1.z.string().regex(/^\d+(K|M)?$/, "Views must be like 89K or 1M"),
    dateLabel: zod_1.z.string().min(3, "Date label is required"),
    duration: zod_1.z.string().regex(/^\d+:\d{2}$/, "Duration must be mm:ss"),
    brand: zod_1.z.string().min(2, "Brand is required"),
    featured: zod_1.z.boolean().optional(),
});
exports.CampaignValidation = {
    campaignSchema: exports.campaignSchema
};
