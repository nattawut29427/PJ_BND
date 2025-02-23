// app/api/order/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/lib/pusher";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // ดึงข้อมูล session สำหรับลูกค้า
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = session.user.id;

    // รับข้อมูลจาก body: รายการสินค้ากับ paymentType
    const {
      items,
      paymentType,
    }: {
      items: { skewerId: number; quantity: number }[];
      paymentType: "cash" | "card" | "online";
    } = await req.json();

    // สร้าง Order โดยตั้งสถานะเป็น "pending"
    const order = await prisma.order.create({
      data: {
        customerId,
        totalPrice: 0, // ราคาเริ่มต้น
        status: OrderStatus.pending, // สถานะเริ่มต้น
      },
    });

    let totalPrice = 0;

    // สร้าง OrderItem, คำนวณราคา และลดจำนวนสินค้าคงเหลือ
    await Promise.all(
      items.map(async (item) => {
        // ดึงข้อมูลสินค้าจาก Skewer
        const skewer = await prisma.skewer.findUnique({
          where: { id: item.skewerId },
        });
        if (!skewer) {
          throw new Error(`Skewer with ID ${item.skewerId} not found`);
        }
        if (skewer.quantity < item.quantity) {
          throw new Error(
            `Not enough stock for Skewer with ID ${item.skewerId}`
          );
        }
        const price = skewer.price * item.quantity;
        totalPrice += price;

        // สร้าง OrderItem
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            skewerId: item.skewerId,
            quantity: item.quantity,
            price,
          },
        });

        // ลดจำนวนสินค้าคงเหลือ
        await prisma.skewer.update({
          where: { id: item.skewerId },
          data: { quantity: skewer.quantity - item.quantity },
        });
      })
    );

    // ✅ อัปเดต totalPrice ใน Order และดึงค่าที่อัปเดตใหม่
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { totalPrice },
      select: { id: true, totalPrice: true, status: true }, // ดึงค่า totalPrice และ status ที่อัปเดตแล้ว
    });

    // ส่งออเดอร์ไปยัง Pusher หลังจากอัปเดต totalPrice เสร็จ
    await pusherServer.trigger("orders", "new-order", {
      id: updatedOrder.id,
      totalPrice: updatedOrder.totalPrice,
      status: updatedOrder.status, // ส่งสถานะที่อัปเดตแล้วไปด้วย
    });

    // สร้าง Bill โดยยังไม่มี cashier (cashierId = null)
    const bill = await prisma.bill.create({
      data: {
        orderId: order.id,
        totalPrice,
        paymentType,
        cashierId: null,
      },
    });

    // สร้าง Transaction โดยยังไม่มี cashier (cashierId = null)
    const transaction = await prisma.transaction.create({
      data: {
        billId: bill.id,
        amountPaid: totalPrice,
        paymentType,
        cashierId: null,
      },
    });

    const updatedStatusOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.pending}, // เปลี่ยนสถานะเป็น cooking
      select: { id: true, status: true },
    });

    // ส่งสถานะที่อัปเดตไปยัง Pusher
    await pusherServer.trigger("orders", "order-status-updated", {
      id: updatedStatusOrder.id,
      status: updatedStatusOrder.status,
    });

    return NextResponse.json(
      {
        orderId: updatedOrder.id,
        totalPrice: updatedOrder.totalPrice,
        billId: bill.id,
        transactionId: transaction.id,
        status: updatedStatusOrder.status, // สถานะที่อัปเดต
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Error processing order" },
      { status: 500 }
    );
  }
}
