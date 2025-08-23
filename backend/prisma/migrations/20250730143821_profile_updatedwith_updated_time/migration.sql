/*
  Warnings:

  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Messages" ALTER COLUMN "Image" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "profilepic" SET DATA TYPE TEXT;
