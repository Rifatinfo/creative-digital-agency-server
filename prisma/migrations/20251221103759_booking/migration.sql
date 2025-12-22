/*
  Warnings:

  - Made the column `customerEmail` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'PAID', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentGetWayData" JSONB,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "customerEmail" SET NOT NULL;

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "projectDetails" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "planId" TEXT NOT NULL,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ServicePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
