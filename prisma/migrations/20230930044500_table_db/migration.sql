-- CreateTable
CREATE TABLE "tables" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "isPrivate" BOOLEAN NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);
