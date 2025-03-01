import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ปรับ path ให้ถูกต้องตามโปรเจคของคุณ

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // ดึงข้อมูล session จาก NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // สมมุติว่า session.user มี field id ซึ่งเป็น cashierId
    const cashierId = session.user.id;

    // รับข้อมูลจาก body
    const {
      customerId,
      items,
      paymentType,
    }: {
      customerId: string;
      items: { skewerId: number; quantity: number }[];
      paymentType: "cash" | "card" | "online";
    } = await req.json();

    // สร้าง Order
    const order = await prisma.order.create({
      data: {
        customerId: customerId,
        totalPrice: 0, 
      },
    });

    let totalPrice = 0;

    // สร้าง OrderItem, คำนวณราคา และลดจำนวนสินค้าใน Skewer
    await Promise.all(
      items.map(async (item) => {
        // ดึงข้อมูลสินค้าจาก Skewer
        const skewer = await prisma.skewer.findUnique({ where: { id: item.skewerId } });
        
        if (!skewer) {
          throw new Error(`Skewer with ID ${item.skewerId} not found`);
        }

        // ตรวจสอบว่าสินค้ามีพอสำหรับการสั่งซื้อหรือไม่
        if (skewer.quantity < item.quantity) {
          throw new Error(`Not enough stock for Skewer with ID ${item.skewerId}`);
        }

        const price = skewer.price * item.quantity;
        
        totalPrice += price;

        // สร้าง OrderItem
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            skewerId: item.skewerId,
            quantity: item.quantity,
            price: price,
          },
        });

        // ลดจำนวนสินค้าคงเหลือใน Skewer
        await prisma.skewer.update({
          where: { id: item.skewerId },
          data: { quantity: skewer.quantity - item.quantity },
        });
      })
    );

    // อัปเดต totalPrice ใน Order
    await prisma.order.update({
      where: { id: order.id },
      data: { totalPrice },
    });

    // สร้าง Bill โดยใช้ cashierId จาก session
    const bill = await prisma.bill.create({
      data: {
        orderId: order.id,
        totalPrice,
        paymentType,
        cashierId, // ใช้ cashierId จาก session
      },
    });

    // สร้าง Transaction โดยใช้ cashierId จาก session
    const transaction = await prisma.transaction.create({
      data: {
        billId: bill.id,
        amountPaid: totalPrice,
        paymentType,
        cashierId, // ใช้ cashierId จาก session
      },
    });

    return NextResponse.json(
      {
        orderId: order.id,
        totalPrice,
        transactionId: transaction.id,
        status: "Order created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
   

    return NextResponse.json(
      { error: error.message || "Error processing order" },
      { status: 500 }
    );
  }
}
