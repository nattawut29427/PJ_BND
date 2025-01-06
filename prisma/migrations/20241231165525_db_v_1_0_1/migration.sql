/*
  Warnings:

  - You are about to drop the column `lastUpdated` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the `SkewerInventory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[skewerId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `skewerId` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SkewerInventory" DROP CONSTRAINT "SkewerInventory_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "SkewerInventory" DROP CONSTRAINT "SkewerInventory_skewerId_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "lastUpdated",
ADD COLUMN     "skewerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SkewerInventory";

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_skewerId_key" ON "Inventory"("skewerId");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_skewerId_fkey" FOREIGN KEY ("skewerId") REFERENCES "Skewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
