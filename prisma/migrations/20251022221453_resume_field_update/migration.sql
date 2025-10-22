/*
  Warnings:

  - The primary key for the `Cover_Letter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `file` on the `Cover_Letter` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Cover_Letter` table. All the data in the column will be lost.
  - The primary key for the `Resume` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `file` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `cover_letter_id` on the `User_Job` table. All the data in the column will be lost.
  - You are about to drop the column `resume_id` on the `User_Job` table. All the data in the column will be lost.
  - Added the required column `name` to the `Cover_Letter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Cover_Letter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume_name` to the `User_Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."User_Job" DROP CONSTRAINT "User_Job_cover_letter_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."User_Job" DROP CONSTRAINT "User_Job_resume_id_fkey";

-- DropIndex
DROP INDEX "public"."Cover_Letter_file_key";

-- DropIndex
DROP INDEX "public"."Resume_file_key";

-- AlterTable
ALTER TABLE "Cover_Letter" DROP CONSTRAINT "Cover_Letter_pkey",
DROP COLUMN "file",
DROP COLUMN "id",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD CONSTRAINT "Cover_Letter_pkey" PRIMARY KEY ("user_id", "name");

-- AlterTable
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_pkey",
DROP COLUMN "file",
DROP COLUMN "id",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD CONSTRAINT "Resume_pkey" PRIMARY KEY ("user_id", "name");

-- AlterTable
ALTER TABLE "User_Job" DROP COLUMN "cover_letter_id",
DROP COLUMN "resume_id",
ADD COLUMN     "cover_letter_name" TEXT,
ADD COLUMN     "resume_name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User_Job" ADD CONSTRAINT "User_Job_user_id_resume_name_fkey" FOREIGN KEY ("user_id", "resume_name") REFERENCES "Resume"("user_id", "name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Job" ADD CONSTRAINT "User_Job_user_id_cover_letter_name_fkey" FOREIGN KEY ("user_id", "cover_letter_name") REFERENCES "Cover_Letter"("user_id", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
