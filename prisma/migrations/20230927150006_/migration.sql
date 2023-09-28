/*
  Warnings:

  - Made the column `productDetails` on table `Bill` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Bill" ALTER COLUMN "productDetails" SET NOT NULL,
ALTER COLUMN "productDetails" SET DATA TYPE JSON;
