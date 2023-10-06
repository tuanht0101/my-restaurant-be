/*
  Warnings:

  - You are about to drop the column `contactNumber` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `bills` table. All the data in the column will be lost.
  - Added the required column `guessName` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guessNumber` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tableName` to the `bills` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('CANCELLED', 'PENDING', 'DONE');

-- AlterTable
ALTER TABLE "bills" DROP COLUMN "contactNumber",
DROP COLUMN "name",
ADD COLUMN     "guessName" TEXT NOT NULL,
ADD COLUMN     "guessNumber" TEXT NOT NULL,
ADD COLUMN     "status" "BillStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "tableName" TEXT NOT NULL;
