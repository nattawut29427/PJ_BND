-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_cashierId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_cashierId_fkey";

-- AlterTable
CREATE SEQUENCE bill_orderid_seq;
ALTER TABLE "Bill" ALTER COLUMN "orderId" SET DEFAULT nextval('bill_orderid_seq'),
ALTER COLUMN "paymentType" DROP NOT NULL,
ALTER COLUMN "cashierId" DROP NOT NULL;
ALTER SEQUENCE bill_orderid_seq OWNED BY "Bill"."orderId";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "paymentType" DROP NOT NULL,
ALTER COLUMN "cashierId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
