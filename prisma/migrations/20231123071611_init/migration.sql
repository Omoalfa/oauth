/*
  Warnings:

  - Made the column `isVerified` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "verificationCode" DROP NOT NULL,
ALTER COLUMN "isVerified" SET NOT NULL;
