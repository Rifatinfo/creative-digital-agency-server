import { Request } from "express"
import { fileUploader } from "../../helper/fileUploader";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "../../../generated/prisma/client";
import { userSearchField } from "./user.constant";

const createCustomer = async (req: Request) => {
    let profilePhotoUrl: string | undefined;

    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        profilePhotoUrl = uploadResult?.secure_url;
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const result = await prisma.$transaction(async (tx) => {
        await tx.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                profilePhoto: profilePhotoUrl,
                role: "CLIENT",
            },
        })

        return await tx.customer.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                profilePhoto: profilePhotoUrl,
            }
        })
    })

    return result;
}

const getAllFromDB = async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];
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

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    const total = await prisma.user.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}
export const UserService = {
    createCustomer,
    getAllFromDB
}