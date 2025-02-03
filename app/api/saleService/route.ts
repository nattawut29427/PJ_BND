import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sum = searchParams.get("sum")
    const dailySale = searchParams.get("dailySale");
    const quantitySale = searchParams.get("quanSale")

    if (quantitySale) {
      const totalSaleAmount = await prisma.sale.aggregate({
        _sum: {
          quantity: true,
        },
      });

      return NextResponse.json({
        totalAmount: totalSaleAmount._sum.quantity || 0,
      });
    }

    if (dailySale) {
      
      const dailySaleAmount = await prisma.totalSale.groupBy({
        by: ["createdAt"], 
        _sum: {
          totalPrice: true, 
        },
        orderBy: {
          createdAt: "asc", 
        },
      });

      const aggregatedData = dailySaleAmount.reduce((acc: { [key: string]: number }, item) => {
        const date = item.createdAt.toISOString().split("T")[0];
        
        const totalPrice = item._sum.totalPrice ?? 0;
      
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += totalPrice;
        return acc;
      }, {});
  
      const formattedData = Object.keys(aggregatedData).map(date => ({
        date,
        totalAmount: aggregatedData[date],
      }));

      return NextResponse.json(formattedData);
    }


    if (sum) {
      const totalSaleAmount = await prisma.totalSale.aggregate({
        _sum: {
          totalPrice: true,
        },
      });

      return NextResponse.json({
        totalAmount: totalSaleAmount._sum.totalPrice || 0,
      });
    }

    
    return NextResponse.json({ message: 'Please specify query parameters.' });

  } catch (error) {
    
    console.error("Error fetching daily sale data:", error);
    
    return NextResponse.json(
      
      { error: "Unable to fetch daily sale data" },
      
      { status: 500 }
    );
  }
}

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
      
      const totalSaleRecord = await tx.totalSale.create({
        data: {
          totalPrice,
        },
      });

     // Sale แต่ละรายการและอัปเดตสต็อก
      const createdSales = await Promise.all(
        sales.map(async (saleItem) => {
          
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
