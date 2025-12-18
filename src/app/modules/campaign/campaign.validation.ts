import { z } from "zod";

export const campaignSchema = z.object({
  title: z.string().min(3, "Title is required"),
  category: z.string().min(3, "Category is required"),
  subcategory: z.string().min(3, "Subcategory is required"),
  thumbnail: z.url().optional(),
  videoUrl: z.url("Video URL must be a valid URL"),
  views: z.string().regex(/^\d+(K|M)?$/, "Views must be like 89K or 1M"),
  dateLabel: z.string().min(3, "Date label is required"),

  duration: z.string().regex(/^\d+:\d{2}$/, "Duration must be mm:ss"),
  brand: z.string().min(2, "Brand is required"),
  featured: z.boolean().optional(),
});

export const CampaignValidation = {
  campaignSchema
};