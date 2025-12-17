import { Request } from "express";
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";

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

export const UserService = {
  createAdmin
}

