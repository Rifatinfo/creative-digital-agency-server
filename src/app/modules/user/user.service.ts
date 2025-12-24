import { Request } from "express"
import { fileUploader } from "../../helper/fileUploader";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma, UserRole, UserStatus } from "../../../generated/prisma/client";
import { userSearchField } from "./user.constant";
import { IAuthUser } from "../../../types/common";

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

const getMyProfile = async (user?: IAuthUser) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        }
    });
    let profileInfo;
    if (userInfo.role === "ADMIN") {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            },
            select: {
                id: true,
                name: true,
                email: true,
                profilePhoto: true,
                createdAt: true,
                updatedAt: true
            }
        })
    } else if (userInfo.role === "CLIENT") {
        profileInfo = await prisma.customer.findUnique({
            where: {
                email: userInfo.email
            },
            select: {
                id: true,
                email: true,
                phone: true,
                name: true,
                address: true,
                profilePhoto: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
    return {...userInfo, ...profileInfo};
}

const updateMyProfile = async (req: Request, user?: IAuthUser) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where : {
            email : user?.email,
            status : UserStatus.ACTIVE
        }
    });
    const file = req.file;
    if(file){
       const updateToCloudinary = await fileUploader.uploadToCloudinary(file);
       req.body.profilePhoto = updateToCloudinary?.secure_url;
    }

    const {name, phone, address, profilePhoto, password} = req.body;
    const userUpdate : any = {};
    if(password){
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
    }

    const profileUpdate = {name, phone, address, profilePhoto};
    if(userInfo.role === UserRole.ADMIN){
        return  await prisma.admin.update({
            where : {
                email : userInfo.email
            },
            data : {...profileUpdate, 
                user : {
                    update : userUpdate
                }
            },
            
        });
    }else if(userInfo.role === UserRole.CLIENT){
        return await prisma.customer.update({
            where : {
                email : userInfo.email
            },
            data : {...profileUpdate, 
                user : {
                    update : userUpdate
                }
            },
            
        });
    }
   
}
const changeProfileStatus = async (id : string, payload : {status : UserStatus}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where : {
            id 
        }
    });

    const updateUserStatus = await prisma.user.update({
        where : {
            id
        },
        data : payload,
    });
    return updateUserStatus;
}


export const UserService = {
    createCustomer,
    getAllFromDB,
    getMyProfile,
    updateMyProfile,
    changeProfileStatus
}

