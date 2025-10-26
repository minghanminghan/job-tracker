/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Cover_Letter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Cover_Letter` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Resume` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Cover_Letter" ADD COLUMN     "id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cover_Letter_id_key" ON "Cover_Letter"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_id_key" ON "Resume"("id");
