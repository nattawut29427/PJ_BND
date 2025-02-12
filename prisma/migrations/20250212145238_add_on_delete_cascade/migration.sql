-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_skewerId_fkey";

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_skewerId_fkey" FOREIGN KEY ("skewerId") REFERENCES "Skewer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
