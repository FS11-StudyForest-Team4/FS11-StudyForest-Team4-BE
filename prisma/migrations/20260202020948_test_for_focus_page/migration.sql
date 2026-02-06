-- DropForeignKey
ALTER TABLE "Focus" DROP CONSTRAINT "Focus_studyId_fkey";

-- AlterTable
ALTER TABLE "Study" ALTER COLUMN "totalPoint" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Focus" ADD CONSTRAINT "Focus_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;
