import { StatusCodes } from "http-status-codes";
import { UserRole } from "../../../generated/prisma/enums";
import { JwtUser } from "../../../types/express"
import AppError from "../../middlewares/AppError";
import { prisma } from "../../config/db";

const fetchDashboardMetaData = async (user: JwtUser) => {
    let metadata;
    switch (user.role) {
        case UserRole.ADMIN:
            metadata = await getAdminMetaData();
            break;
        case UserRole.CLIENT:
            metadata = await getClientMetaData(user);
            break;
        default:
            throw new AppError(StatusCodes.BAD_REQUEST, "Role not supported for metadata");
    }

    return metadata;
}

const getClientMetaData = async (user: JwtUser) => {

}

const getAdminMetaData = async () => {

}

const getBarChartData = async () => {
    const appointmentCountPerMonth = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month,
        CAST(COUNT(*) AS INTEGER) AS count
        FROM "appointments"
        GROUP BY month
        ORDER BY month ASC
    `

    return appointmentCountPerMonth
}

const getPieChartData = async () => {

}

export const MetaService = {
    fetchDashboardMetaData
}