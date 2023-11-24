/*
  Warnings:

  - Added the required column `scopes` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "scopes" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "password" DROP NOT NULL;
