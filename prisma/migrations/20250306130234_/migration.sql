/*
  Warnings:

  - You are about to drop the column `kanji` on the `Word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Word" DROP COLUMN "kanji",
ADD COLUMN     "word" TEXT;
