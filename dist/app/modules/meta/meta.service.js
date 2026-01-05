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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaService = void 0;
const http_status_codes_1 = require("http-status-codes");
const enums_1 = require("../../../generated/prisma/enums");
const AppError_1 = __importDefault(require("../../middlewares/AppError"));
const db_1 = require("../../config/db");
const fetchDashboardMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let metadata;
    switch (user.role) {
        case enums_1.UserRole.ADMIN:
            metadata = yield getAdminMetaData();
            break;
        case enums_1.UserRole.CLIENT:
            metadata = yield getClientMetaData(user);
            break;
        default:
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Role not supported for metadata");
    }
    return metadata;
});
const getClientMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
});
const getAdminMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const clientCount = yield db_1.prisma.customer.count();
    const bookingCount = yield db_1.prisma.booking.count();
    const adminCount = yield db_1.prisma.admin.count();
    const paymentCount = yield db_1.prisma.payment.count();
    const totalRevenue = yield db_1.prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: enums_1.PaymentStatus.PAID
        }
    });
    const barChartData = yield getBarChartData();
    const pieChartData = yield getPieChartData();
    return {
        clientCount,
        bookingCount,
        adminCount,
        paymentCount,
        totalRevenue,
        barChartData,
        pieChartData
    };
});
const getBarChartData = () => __awaiter(void 0, void 0, void 0, function* () {
    const bookingCountPerMonth = yield db_1.prisma.$queryRaw `
    SELECT DATE_TRUNC('month', "createdAt") AS month ,
    CAST(COUNT(*) AS INTEGER) AS count 
    FROM "Booking"
    GROUP BY month
    ORDER BY month ASC
    `;
    return bookingCountPerMonth;
});
const getPieChartData = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.prisma.payment.groupBy({
        by: ["status"],
        _count: { id: true }
    });
    const total = data.reduce((sum, item) => sum + item._count.id, 0);
    return data.map(({ status, _count }) => ({
        status,
        count: Number(_count.id),
        percentage: Number(((_count.id / total) * 100).toFixed(2)),
    }));
});
exports.MetaService = {
    fetchDashboardMetaData
};
