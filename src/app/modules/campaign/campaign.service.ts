import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../config/db";
import AppError from "../../middlewares/AppError";
import { StatusCodes } from "http-status-codes";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "../../../generated/prisma/client";
import { userSearchField } from "./campaign.constant";
import { Project } from "./campaign.interface";

const createCampaign = async (req: Request) => {
    if (!req.user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    let profilePhotoUrl: string | undefined;

    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        profilePhotoUrl = uploadResult?.secure_url;
    }

    const newCampaign = await prisma.campaign.create({

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
}

const getAllCampaignFromDB = async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.CampaignWhereInput[] = [];
    if (searchTerm) {
        andConditions.push({
            OR: userSearchField.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }
    const whereConditions: Prisma.CampaignWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const result = await prisma.campaign.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    })
    const total = await prisma.campaign.count({
        where: whereConditions
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}

const updateCampaignIntoDB = async (id: number, payload: Partial<Project>) => {
    console.log(payload);
    
    const campaignInfo = await prisma.campaign.findUniqueOrThrow({
        where: {
            id,
        }
    });

    await prisma.campaign.update({
        where: {
            id
        },
        data : payload
    })
    const responseData = await prisma.campaign.findUnique({
        where : {
            id : campaignInfo.id
        }
    });
    return responseData;
}

const deleteCampaignFromDB = async (id: number) => {
    const campaign = await prisma.campaign.findUnique({
        where: { id }
    });

    if (!campaign) {
        throw new AppError( 404, "Campaign not found");
    }

    const result = await prisma.campaign.delete({ where: { id } });

    return result ;
};



export const CampaignService = {
    createCampaign,
    getAllCampaignFromDB,
    updateCampaignIntoDB,
    deleteCampaignFromDB
}


