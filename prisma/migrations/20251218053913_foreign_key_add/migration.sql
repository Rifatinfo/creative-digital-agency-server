/*
  Warnings:

  - You are about to drop the column `adminId` on the `Campaign` table. All the data in the column will be lost.
  - Added the required column `adminEmail` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_adminId_fkey";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "adminId",
ADD COLUMN     "adminEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_adminEmail_fkey" FOREIGN KEY ("adminEmail") REFERENCES "admin"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
