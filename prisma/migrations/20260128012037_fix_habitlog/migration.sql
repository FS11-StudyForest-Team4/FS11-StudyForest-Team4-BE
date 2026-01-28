/*
  Warnings:

  - The values [DESIGIN] on the enum `Background` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `History` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Background_new" AS ENUM ('GREEN', 'YELLOW', 'BLUE', 'PINK', 'DESIGN', 'STUDY', 'TILE', 'LEAF');
ALTER TABLE "Study" ALTER COLUMN "background" TYPE "Background_new" USING ("background"::text::"Background_new");
ALTER TYPE "Background" RENAME TO "Background_old";
ALTER TYPE "Background_new" RENAME TO "Background";
DROP TYPE "public"."Background_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_habitId_fkey";

-- DropTable
DROP TABLE "History";

-- CreateTable
CREATE TABLE "Habitlog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "habitId" TEXT NOT NULL,

    CONSTRAINT "Habitlog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Habitlog" ADD CONSTRAINT "Habitlog_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
