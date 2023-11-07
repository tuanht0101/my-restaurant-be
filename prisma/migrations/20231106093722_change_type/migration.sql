/*
  Warnings:

  - You are about to alter the column `total` on the `bills` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "bills" ALTER COLUMN "total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE INTEGER;
