-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "location" TEXT[],
ADD COLUMN     "salary_max" INTEGER,
ADD COLUMN     "salary_min" INTEGER;

-- AlterTable
ALTER TABLE "User_Job" ADD COLUMN     "appliedDate" TIMESTAMP(3),
ADD COLUMN     "interviewDate" TIMESTAMP(3),
ADD COLUMN     "offerDate" TIMESTAMP(3),
ADD COLUMN     "pendingDate" TIMESTAMP(3),
ADD COLUMN     "rejectedDate" TIMESTAMP(3);
