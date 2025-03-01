// app/api/order/accept/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient, OrderStatus } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     // ดึงข้อมูลออเดอร์จากฐานข้อมูล
//     const orders = await prisma.order.findMany({
//       where: { status: { not: 'completed' } },
//       include: { orderItems: true }
//     });

//     return NextResponse.json({ orders });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "เกิดข้อผิดพลาดในการดึงออเดอร์" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const cashierId = session.user.id;

    const { orderId } = (await req.json()) as { orderId: number };

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let newStatus: OrderStatus;


    if (order.status === OrderStatus.pending) {
      newStatus = OrderStatus.canceled;
      

   
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

    // Trigger event แจ้งอัปเดตสถานะผ่าน Pusher
    await pusherServer.trigger(`orders`, "status-updated", updatedOrder);

    

    await pusherServer.trigger(`orders-${orderId}`, "status-updated", {
      orderId: updatedOrder.id,
      status: newStatus,
    });
    

    // หากสถานะเป็น canceled ให้ทำการลบข้อมูลที่เกี่ยวข้องตามลำดับ
    if (newStatus === OrderStatus.canceled) {
      setTimeout(async () => {
        try {
          // 1. หากมี Bill ที่เกี่ยวข้องให้ลบ Transaction ก่อน
          const billToDelete = await prisma.bill.findUnique({
            where: { orderId },
          });

          if (billToDelete) {
            await prisma.transaction.deleteMany({
              where: { billId: billToDelete.id },
            });
            // 2. ลบ Bill

            await prisma.bill.delete({ where: { id: billToDelete.id } });
          }

          // 3. ลบ OrderItems ที่เกี่ยวข้องกับ Order
          await prisma.orderItem.deleteMany({ where: { orderId } });

          // 4. ลบ Order
          await prisma.order.delete({ where: { id: orderId } });
         

          await pusherServer.trigger("orders", "order-deleted", { orderId });
        } catch (deleteError) {
          return deleteError
        }
      });
    }

    return NextResponse.json(
      {
        status: newStatus,
        orderId: updatedOrder.id,
      },
      { status: 200 }
    );
  } catch (error: any) {

    return NextResponse.json(
      { error: error.message || "Error processing order cancellation" },
      { status: 500 }
    );
  }
}
