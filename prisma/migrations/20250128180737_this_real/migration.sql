-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "totalSaleId" INTEGER;

-- CreateTable
CREATE TABLE "TotalSale" (
    "id" SERIAL NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TotalSale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_totalSaleId_fkey" FOREIGN KEY ("totalSaleId") REFERENCES "TotalSale"("id") ON DELETE SET NULL ON UPDATE CASCADE;
