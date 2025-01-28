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

      // สร้าง Sale และเชื่อมโยงกับ TotalSale
      const salesRecords = await Promise.all(
        sales.map((item) =>
          tx.sale.create({
            data: {
              skewerId: item.skewerId,
              quantity: item.quantity,
              totalSaleId: totalSaleRecord.id, // เชื่อมโยงกับ TotalSale
            },
          })
        )
      );

      return { salesRecords, totalSaleRecord };
    });

    if (!createdSales || !createdSales.salesRecords || !createdSales.totalSaleRecord) {
      return NextResponse.json(
        { error: 'Failed to create sales' },
        { status: 500 }
      );
    }

    return NextResponse.json(createdSales, { status: 201 });
  } catch (error) {
    console.error('Error creating sales:', error);
    return NextResponse.json(
      { error: 'Failed to create sales' },
      { status: 500 }
    );
  }
}