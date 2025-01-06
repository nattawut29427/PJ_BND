/*
  Warnings:

  - You are about to drop the column `name` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_skewerId_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "name",
DROP COLUMN "unit";

-- AlterTable
ALTER TABLE "Skewer" ADD COLUMN     "images" TEXT;

-- DropTable
DROP TABLE "Image";

-- CreateTable
CREATE TABLE "SkewerInventory" (
    "id" SERIAL NOT NULL,
    "skewerId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SkewerInventory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SkewerInventory" ADD CONSTRAINT "SkewerInventory_skewerId_fkey" FOREIGN KEY ("skewerId") REFERENCES "Skewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkewerInventory" ADD CONSTRAINT "SkewerInventory_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
