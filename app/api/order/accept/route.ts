// app/api/order/accept/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/lib/pusher";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // ดึงข้อมูล session สำหรับพนักงาน (cashier)
    const session = await getServerSession(authOptions);
   
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const cashierId = session.user.id;

    // รับข้อมูลจาก body: orderId ที่พนักงานต้องการรับออเดอร์
    const { orderId } = (await req.json()) as { orderId: number };

    // ตรวจสอบว่า Order มีอยู่จริงหรือไม่
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ตรวจสอบและเปลี่ยนสถานะออเดอร์ตามลำดับ:
    // ถ้า Order อยู่ในสถานะ pending ให้เปลี่ยนเป็น cooking
    // ถ้า Order อยู่ในสถานะ cooking ให้เปลี่ยนเป็น complete
    let newStatus: OrderStatus;
    
    if (order.status === OrderStatus.pending) {
      newStatus = OrderStatus.cooking;
      console.log(newStatus)
    } else if (order.status === OrderStatus.cooking) {
      newStatus = OrderStatus.completed
    } else {
      return NextResponse.json(
        { error: "Order is already complete" },
        { status: 400 }
      );
    }

    // อัปเดตสถานะ Order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // หากมี Bill ที่เกี่ยวข้อง ให้บันทึกข้อมูล cashier ลงใน Bill และ Transaction
    const bill = await prisma.bill.findUnique({ where: { orderId } });
    
    if (bill) {
      await prisma.bill.update({
        where: { id: bill.id },
        data: { cashierId },
      });
      await prisma.transaction.updateMany({
        where: { billId: bill.id },
        data: { cashierId },
      });
    }

    await pusherServer.trigger(`orders`, "status-updated", updatedOrder);

    console.log("Pusher Triggered:", `orders-${orderId}`, newStatus);
    
    await pusherServer.trigger(`orders-${orderId}`, "status-updated", {
      orderId: updatedOrder.id,
      status: newStatus,
    });
   
    console.log("Pusher Triggered:", `orders-${orderId}`, newStatus); 

    return NextResponse.json(
      {
        status: newStatus,
        orderId: updatedOrder.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
   
    return NextResponse.json(
      { error: error.message || "Error processing order acceptance" },
      { status: 500 }
    );
  }
}
