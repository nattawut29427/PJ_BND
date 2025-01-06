/*
  Warnings:

  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantity` to the `Skewer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_skewerId_fkey";

-- AlterTable
ALTER TABLE "Skewer" ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Inventory";

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "skewerId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_skewerId_fkey" FOREIGN KEY ("skewerId") REFERENCES "Skewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
