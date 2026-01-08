// import { prisma } from "../../../config/db"
import prisma from "../../shared/prisma";
import { IService } from "./service.interface"

const createServiceInto = async (payload: IService) => {
    return prisma.service.create({
        data: payload
    });
}

const getServicesFrom = async () => {
    return prisma.service.findMany({
        where : {
            isActive : true
        },
        include : {
            servicePlans : true
        }
    })
}

export const ServiceService = {
    createServiceInto,
    getServicesFrom
}

