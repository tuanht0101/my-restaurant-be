/*
  Warnings:

  - You are about to drop the `Bill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Bill";

-- CreateTable
CREATE TABLE "bills" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "productDetails" JSONB NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);
