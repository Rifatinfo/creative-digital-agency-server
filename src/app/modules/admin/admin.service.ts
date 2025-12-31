import { Request } from "express";
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";
import { Admin, Prisma, UserRole, UserStatus } from "../../../generated/prisma/client";
import { userSearchField } from "../user/user.constant";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { IAuthUser } from "../../../types/common";
import AppError from "../../middlewares/AppError";
import { StatusCodes } from "http-status-codes";

const createAdmin = async (req: Request) => {
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
        role: "ADMIN",
      },
    });

    return await tx.admin.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        profilePhoto: profilePhotoUrl,
      },
    });
  });

  return result;
};

const getAllFromDB = async (params: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [
    {
      role: "ADMIN",
    },
  ];
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


const updateAdminById = async (
  req: Request,
  adminId: string,
  authUser?: IAuthUser
) => {
  if (!authUser || authUser.role !== UserRole.ADMIN) {
    throw new AppError(StatusCodes.FORBIDDEN, "Forbidden");
  }

  // Find target admin
  const admin = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminId,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  // Handle file upload
  if (req.file) {
    const uploaded = await fileUploader.uploadToCloudinary(req.file);
    req.body.profilePhoto = uploaded?.secure_url;
  }

  const { name, phone, address, profilePhoto, password } = req.body;

  const updateData: any = {
    name,
    phone,
    address,
    profilePhoto,
  };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  return prisma.user.update({
    where: { id: admin.id },
    data: updateData,
  });
};

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
      role: "ADMIN",
    }
  })

  return result;
};

const deleteFromDB = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    // if you still have campaign/admin cleanup
    await tx.campaign.deleteMany({
      where: { adminEmail: user.email },
    });

    // optional (if admin table still exists)
    await tx.admin.deleteMany({
      where: { email: user.email },
    });

    return await tx.user.delete({
      where: { id },
    });
  });
};



export const UserService = {
  createAdmin,
  getAllFromDB,
  updateAdminById,
  getByIdFromDB,
  deleteFromDB
}

