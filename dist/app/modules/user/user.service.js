"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const fileUploader_1 = require("../../helper/fileUploader");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../config/db");
const paginationHelper_1 = require("../../helper/paginationHelper");
const client_1 = require("../../../generated/prisma/client");
const user_constant_1 = require("./user.constant");
const AppError_1 = __importDefault(require("../../middlewares/AppError"));
const http_status_codes_1 = require("http-status-codes");
const createCustomer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let profilePhotoUrl;
    if (req.file) {
        const uploadResult = yield fileUploader_1.fileUploader.uploadToCloudinary(req.file);
        profilePhotoUrl = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    const hashPassword = yield bcryptjs_1.default.hash(req.body.password, 10);
    const result = yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                profilePhoto: profilePhotoUrl,
                role: "CLIENT",
            },
        });
        return yield tx.customer.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                profilePhoto: profilePhotoUrl,
            }
        });
    }));
    return result;
});
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    // const andConditions: Prisma.UserWhereInput[] = [];
    const andConditions = [
        {
            role: "CLIENT",
        },
    ];
    if (searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchField.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    const whereConditions = andConditions.length > 0 ? {
        AND: andConditions
    } : {};
    const result = yield db_1.prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = yield db_1.prisma.user.count({
        where: whereConditions
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield db_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE
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
        profileInfo = yield db_1.prisma.admin.findUnique({
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
        });
    }
    else if (userInfo.role === "CLIENT") {
        profileInfo = yield db_1.prisma.customer.findUnique({
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
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const updateMyProfile = (req, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield db_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const file = req.file;
    if (file) {
        const updateToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = updateToCloudinary === null || updateToCloudinary === void 0 ? void 0 : updateToCloudinary.secure_url;
    }
    const { name, phone, address, profilePhoto, password } = req.body;
    const userUpdate = {};
    if (password) {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        req.body.password = hashedPassword;
    }
    const profileUpdate = { name, phone, address, profilePhoto };
    if (userInfo.role === client_1.UserRole.ADMIN) {
        return yield db_1.prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: Object.assign(Object.assign({}, profileUpdate), { user: {
                    update: userUpdate
                } }),
        });
    }
    else if (userInfo.role === client_1.UserRole.CLIENT) {
        return yield db_1.prisma.customer.update({
            where: {
                email: userInfo.email
            },
            data: Object.assign(Object.assign({}, profileUpdate), { user: {
                    update: userUpdate
                } }),
        });
    }
});
const changeProfileStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield db_1.prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });
    const updateUserStatus = yield db_1.prisma.user.update({
        where: {
            id
        },
        data: payload,
    });
    return updateUserStatus;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.user.update({
        where: { id },
        data: { status: client_1.UserStatus.INACTIVE },
    });
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.user.findUnique({
        where: {
            id,
            role: "CLIENT",
        }
    });
    return result;
});
const deleteHardFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        // Delete dependents FIRST
        yield tx.campaign.deleteMany({
            where: { adminEmail: user.email },
        });
        yield tx.admin.deleteMany({
            where: { email: user.email },
        });
        yield tx.customer.deleteMany({
            where: { email: user.email },
        });
        // Finally delete user
        return yield tx.user.delete({
            where: { id },
        });
    }));
});
exports.UserService = {
    createCustomer,
    getAllFromDB,
    getMyProfile,
    updateMyProfile,
    changeProfileStatus,
    deleteFromDB,
    getByIdFromDB,
    deleteHardFromDB
};
