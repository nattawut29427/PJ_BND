// app/api/order/status/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // ดึง session ของพนักงาน
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const cashierId = session.user.id;

    // รับข้อมูล orderId จาก body
    const { orderId } = (await req.json()) as { orderId: number };

    // ตรวจสอบว่ามีออเดอร์นี้จริงไหม
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let newStatus: OrderStatus;

    // เปลี่ยนสถานะตามลำดับ
    if (order.status === OrderStatus.pending) {
      newStatus = OrderStatus.cooking; // เปลี่ยนเป็น cooking
    } else if (order.status === OrderStatus.cooking) {
      newStatus = OrderStatus.completed; // เปลี่ยนเป็น complete
    } else {
      return NextResponse.json(
        { error: "Order already completed" },
        { status: 400 }
      );
    }

    // อัปเดตสถานะ Order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    return NextResponse.json(
      {
        message: `Order updated to ${newStatus}`,
        orderId: updatedOrder.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Error updating order status" },
      { status: 500 }
    );
  }
}
