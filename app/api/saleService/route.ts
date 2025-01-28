import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/saleService
export async function POST(request: Request) {
  try {
    // รับข้อมูลจาก Request Body
    const { sales, totalPrice } = await request.json();

    // ตรวจสอบข้อมูล
    if (!Array.isArray(sales) || typeof totalPrice !== 'number') {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // สร้าง Transaction สำหรับบันทึกข้อมูลหลายรายการ
    const createdSales = await prisma.$transaction(async (tx) => {
      // บันทึกข้อมูลการขาย
      const salesRecords = await Promise.all(
        sales.map((item) =>
          tx.sale.create({
            data: {
              skewerId: item.skewerId,
              quantity: item.quantity,
            },
          })
        )
      );

      // บันทึกข้อมูลราคารวม (หากต้องการ)
      const totalSaleRecord = await tx.totalSale.create({
        data: {
          totalPrice,
        },
      });

      return { salesRecords, totalSaleRecord };
    });

    // ส่ง Response กลับ
    return NextResponse.json(createdSales, { status: 201 });
  } catch (error) {
    console.error('Error creating sales:', error);
    return NextResponse.json(
      { error: 'Failed to create sales' },
      { status: 500 }
    );
  }
}