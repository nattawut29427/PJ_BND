-- AlterTable
ALTER TABLE "Bill" ALTER COLUMN "orderId" DROP DEFAULT;
DROP SEQUENCE "bill_orderid_seq";
