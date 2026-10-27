/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,slug]` on the table `Campus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Campus` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Campus_slug_key";

-- AlterTable
ALTER TABLE "Campus" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Campus_ownerId_slug_key" ON "Campus"("ownerId", "slug");

-- AddForeignKey
ALTER TABLE "Campus" ADD CONSTRAINT "Campus_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
