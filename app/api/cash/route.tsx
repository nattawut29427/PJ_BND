// app/api/order/accept/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // ดึงข้อมูล session จาก NextAuth (สำหรับ cashier)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // cashier ใช้ session.user.id
    const cashierId = session.user.id;

    // รับข้อมูลจาก body: orderId ที่ cashier รับคำสั่งซื้อ
    const { orderId } = await req.json() as { orderId: number };

    // ตรวจสอบ Order ว่ามีอยู่และสถานะยัง pending อยู่หรือไม่
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.status !== OrderStatus.pending) {
      return NextResponse.json({ error: "Order already accepted or processed" }, { status: 400 });
    }

    // เปลี่ยนสถานะ Order เป็น accepted
    await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.accepted },
    });

    // สร้าง Bill โดยใช้ cashierId จาก session
    const bill = await prisma.bill.create({
      data: {
        orderId: orderId,
        totalPrice: order.totalPrice,
        paymentType: "cash", 
        cashierId,
      },
    });

    return NextResponse.json(
      {
        billId: bill.id,
        status: "Order accepted and bill created",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Error processing order acceptance" },
      { status: 500 }
    );
  }
}
