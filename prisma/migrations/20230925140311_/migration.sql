-- AlterTable
ALTER TABLE "products" ALTER COLUMN "status" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "productDetails" JSONB,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);
