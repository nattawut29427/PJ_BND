import { NextResponse } from "next/server";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/lib/pusher";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: { in: ["pending", "cooking", "canceled"] } },
      include: {
        orderItems: {
          include: {
            skewer: { select: { id: true, name: true } }, // ต้อง include name
          },
        },
      },
    });
    
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: "ดึงข้อมูลออเดอร์ล้มเหลว" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // ตรวจสอบการเข้าสู่ระบบ (เช่น Cashier)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const cashierId = session.user.id;

    const { orderId } = await req.json();
    
    if (!orderId) {
     
      console.error("Missing orderId");
   
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }
    console.log("Received orderId:", orderId);

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { orderItems: { include: { skewer: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "ไม่พบออเดอร์" }, { status: 404 });
    }

    // เปลี่ยนสถานะ: pending -> cooking, อื่นๆ -> completed
    const newStatus = order.status === "pending" ? "cooking" : "completed";

    // อัปเดตสถานะออเดอร์
    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: newStatus },
      include: { orderItems: { include: { skewer: true } } },
    });

    // เมื่อสถานะเป็น cooking ให้อัปเดต cashierId ใน Bill (และ Transaction)
    if (newStatus === "cooking") {
      const bill = await prisma.bill.findUnique({
        where: { orderId: Number(orderId) },
      });

      if (bill) {
        await prisma.bill.update({
          where: { id: bill.id },
          data: { cashierId },
        });
      }
    }

    // ส่งข้อมูล Real-time ไปยัง Pusher
    await pusherServer.trigger("orders", "status-updated", updatedOrder);
    await pusherServer.trigger(`order-${orderId}`, "status-updated", updatedOrder);

    return NextResponse.json({ status: newStatus });
  } catch (error) {
   
    console.error(error);
    return NextResponse.json({ error: "อัปเดตสถานะล้มเหลว" }, { status: 500 });
  }
}