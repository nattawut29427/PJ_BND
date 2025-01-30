import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { sales, totalPrice } = await request.json();

    if (!Array.isArray(sales) || sales.length === 0) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    const createdSales = await prisma.$transaction(async (tx) => {
      // สร้าง TotalSale ก่อน
      const totalSaleRecord = await tx.totalSale.create({
        data: {
          totalPrice,
        },
      });

      // 2. สร้าง Sale แต่ละรายการและอัปเดตสต็อก
      const createdSales = await Promise.all(
        sales.map(async (saleItem) => {
          // สร้าง Sale
          const sale = await tx.sale.create({
            data: {
              skewerId: saleItem.skewerId,
              quantity: saleItem.quantity,
              totalSaleId:  totalSaleRecord.id,
            },
          });

          // อัปเดตจำนวนสินค้าใน Skewer
          await tx.skewer.update({
            where: { id: saleItem.skewerId },
            data: {
              quantity: { decrement: saleItem.quantity }, // หักลบจำนวน
            },
            select: {
              quantity: true,
            },
          });

          const updatedSkewer = await tx.skewer.findUnique({
            where: { id: saleItem.skewerId },
          });
          
          if (updatedSkewer!.quantity < 0) {
            throw new Error("สต็อกสินค้าไม่เพียงพอ");
          }

          return sale;
        })
      );

      return {  totalSaleRecord, sales: createdSales };
    });

    return NextResponse.json(createdSales, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process sale" },
      { status: 500 }
    );
  }
}