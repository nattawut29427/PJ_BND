import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // รอให้ Promise resolve แล้ว destructuring
    const { id } = await context.params;
    const orderId = Number(id);
   
    if (isNaN(orderId)) {
      
      return NextResponse.json(
        { error: "Invalid Order ID" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            skewer: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
   
    error
   
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function POST(req: Request) {
//   try {
//     // ดึงข้อมูล session สำหรับลูกค้า
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const customerId = session.user.id;

//     // รับข้อมูลจาก body: รายการสินค้ากับ paymentType
//     const {
//       items,
//       paymentType,
//     }: {
//       items: { skewerId: number; quantity: number }[];
//       paymentType: "cash" | "card" | "online";
//     } = await req.json();

//     if (items.length === 0) {
//       return NextResponse.json({ error: "Items list cannot be empty" }, { status: 400 });
//     }

//     // สร้าง Order โดยตั้งสถานะเป็น "pending"
//     const order = await prisma.order.create({
//       data: {
//         customerId,
//         totalPrice: 0, // ราคาเริ่มต้น
//         status: OrderStatus.pending, // สถานะเริ่มต้น
//       },
//     });

//     let totalPrice = 0;

//     // สร้าง OrderItem, คำนวณราคา และลดจำนวนสินค้าคงเหลือ
//     await Promise.all(
//       items.map(async (item) => {
//         // ดึงข้อมูลสินค้าจาก Skewer
//         const skewer = await prisma.skewer.findUnique({
//           where: { id: item.skewerId },
//         });
//         if (!skewer) {
//           throw new Error(`Skewer with ID ${item.skewerId} not found`);
//         }
//         if (skewer.quantity < item.quantity) {
//           throw new Error(`Not enough stock for Skewer with ID ${item.skewerId}`);
//         }
//         const price = skewer.price * item.quantity;
//         totalPrice += price;

//         // สร้าง OrderItem
//         await prisma.orderItem.create({
//           data: {
//             orderId: order.id,
//             skewerId: item.skewerId,
//             quantity: item.quantity,
//             price,
//           },
//         });

//         // ลดจำนวนสินค้าคงเหลือ
//         await prisma.skewer.update({
//           where: { id: item.skewerId },
//           data: { quantity: skewer.quantity - item.quantity },
//         });
//       })
//     );

//     const updatedOrder = await prisma.order.update({
//       where: { id: order.id },
//       data: { totalPrice },
//       select: { id: true, totalPrice: true }, // ดึงค่า totalPrice ที่อัปเดตแล้ว
//     });

//     // ส่งออเดอร์ไปยัง Pusher หลังจากอัปเดต totalPrice เสร็จ
//     await pusherServer.trigger("orders", "new-order", {
//       id: updatedOrder.id,
//       totalPrice: updatedOrder.totalPrice,
//       status: "cooking", // ส่งสถานะ 'cooking'
//     });

//     // // สร้าง Bill โดยยังไม่มี cashier (cashierId = null)
//     // const bill = await prisma.bill.create({
//     //   data: {
//     //     orderId: order.id,
//     //     totalPrice,
//     //     paymentType,
//     //     cashierId: null,
//     //   },
//     // });

//     // // สร้าง Transaction โดยยังไม่มี cashier (cashierId = null)
//     // const transaction = await prisma.transaction.create({
//     //   data: {
//     //     billId: bill.id,
//     //     amountPaid: totalPrice,
//     //     paymentType,
//     //     cashierId: null,
//     //   },
//     // });

  
//     await prisma.order.update({
//       where: { id: order.id },
//       data: { status: OrderStatus.pending },
//     });
 

//     return NextResponse.json(
//       {
//         orderId: updatedOrder.id,
//         totalPrice: updatedOrder.totalPrice,
//         billId: bill.id,
//         transactionId: transaction.id,
//         status: "cooking", // สถานะที่อัปเดต
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error(error);
   
//     return NextResponse.json(
//       { error: error.message || "Error processing order" },
//       { status: 500 }
//     );
//   }
// }