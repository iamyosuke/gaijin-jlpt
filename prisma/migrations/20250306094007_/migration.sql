/*
  Warnings:

  - You are about to drop the column `meaningEn` on the `Example` table. All the data in the column will be lost.
  - You are about to drop the column `meaningEn` on the `Word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Example" DROP COLUMN "meaningEn";

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "meaningEn",
ALTER COLUMN "furigana" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "languageId" INTEGER DEFAULT 1;

-- CreateTable
CREATE TABLE "Meaning" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER,
    "exampleId" INTEGER,
    "languageId" INTEGER NOT NULL,
    "meaning" TEXT NOT NULL,

    CONSTRAINT "Meaning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meaning" ADD CONSTRAINT "Meaning_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meaning" ADD CONSTRAINT "Meaning_exampleId_fkey" FOREIGN KEY ("exampleId") REFERENCES "Example"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meaning" ADD CONSTRAINT "Meaning_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
