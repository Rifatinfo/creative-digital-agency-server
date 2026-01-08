import { StatusCodes } from "http-status-codes";
// import { PaymentStatus, UserRole } from "../../../generated/prisma/enums";
import { JwtUser } from "../../../types/express"
import AppError from "../../middlewares/AppError";
import { PaymentStatus, UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";
// import { prisma } from "../../../config/db";

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
  const clientCount = await prisma.customer.count();
  const bookingCount = await prisma.booking.count();
  const adminCount = await prisma.admin.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum : {
        amount : true
    },
    where : {
        status : PaymentStatus.PAID
    }
  });

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    clientCount,
    bookingCount,
    adminCount,
    paymentCount,
    totalRevenue,
    barChartData,
    pieChartData
  }
}

const getBarChartData = async () => {
    const bookingCountPerMonth = await prisma.$queryRaw<{month : Date; count : number}[]>`
    SELECT DATE_TRUNC('month', "createdAt") AS month ,
    CAST(COUNT(*) AS INTEGER) AS count 
    FROM "Booking"
    GROUP BY month
    ORDER BY month ASC
    `;
    return bookingCountPerMonth;
}

const getPieChartData = async () => {
    const data = await prisma.payment.groupBy({
        by : ["status"],
        _count : {id : true}
    });

    const total = data.reduce((sum , item) => sum + item._count.id, 0);
    return data.map(({ status, _count }) => ({
        status,
        count : Number(_count.id),
        percentage : Number(((_count.id / total) * 100).toFixed(2)),
    }));
}

export const MetaService = {
    fetchDashboardMetaData
}