import { NextResponse } from "next/server";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/lib/pusher";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sum = searchParams.get("sum");
    const dailySale = searchParams.get("dailySale");
    const quantitySale = searchParams.get("quanSale");
    const monthlySale = searchParams.get("monthlySale");
    const yearlySale = searchParams.get("yearlySale");

    if (quantitySale) {
      const totalSaleAmount = await prisma.order.aggregate({
        _count: {
          id: true,
        },
      });

      return NextResponse.json({
        totalAmount: totalSaleAmount._count.id || 0,
      });
    }

    if (dailySale) {
      const dailySaleAmount = await prisma.order.groupBy({
        by: ["orderDate"],
        _sum: {
          totalPrice: true,
        },
        orderBy: {
          orderDate: "asc",
        },
      });

      const aggregatedData = dailySaleAmount.reduce(
        (acc: { [key: string]: number }, item) => {
          const date = item.orderDate.toISOString().split("T")[0];
          const totalPrice = item._sum.totalPrice ?? 0;

          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += totalPrice;
          return acc;
        },
        {}
      );

      const formattedData = Object.keys(aggregatedData).map((date) => ({
        date,
        totalAmount: aggregatedData[date],
      }));

      return NextResponse.json(formattedData);
    }

    if (monthlySale) {
      const monthlySaleAmount = await prisma.order.groupBy({
        by: ["orderDate"],
        _sum: {
          totalPrice: true,
        },
        orderBy: {
          orderDate: "asc",
        },
      });

      const aggregatedMonth = monthlySaleAmount.reduce(
        (acc: { [key: string]: number }, item) => {
          const month = item.orderDate.toISOString().slice(0, 7);
          const totalPrice = item._sum.totalPrice ?? 0;

          if (!acc[month]) acc[month] = 0;
          acc[month] += totalPrice;

          return acc;
        },
        {}
      );

      const formattedData = Object.keys(aggregatedMonth).map((month) => ({
        month,
        totalAmount: aggregatedMonth[month],
      }));

      return NextResponse.json(formattedData);
    }

    if (yearlySale) {
      const yearlySaleAmount = await prisma.order.groupBy({
        by: ["orderDate"],
        _sum: {
          totalPrice: true,
        },
        orderBy: {
          orderDate: "asc",
        },
      });

      const aggregatedYear = yearlySaleAmount.reduce(
        (acc: { [key: string]: number }, item) => {
          const year = item.orderDate.toISOString().slice(0, 4);
          const totalPrice = item._sum.totalPrice ?? 0;

          if (!acc[year]) acc[year] = 0;
          acc[year] += totalPrice;

          return acc;
        },
        {}
      );

      const formattedData = Object.keys(aggregatedYear).map((year) => ({
        year,
        totalAmount: aggregatedYear[year],
      }));

      return NextResponse.json(formattedData);
    }

    if (sum) {
      const totalSaleAmount = await prisma.order.aggregate({
        _sum: {
          totalPrice: true,
        },
      });

      return NextResponse.json({
        totalAmount: totalSaleAmount._sum.totalPrice || 0,
      });
    }

    // ค้นหาคำสั่งซื้อที่มีสถานะเป็น completed
    const completedOrders = await prisma.order.findMany({
      where: {
        status: OrderStatus.completed,
      },
      include: {
        customer: { // เพิ่มส่วนนี้
          select: {
            name: true
          }
        },
        orderItems: {
          include: {
            skewer: {
              select: {
                id: true,
                name: true,
                price: true,
                quantity: true,
              },
            },
          },
        },
      },
    })
    
    // ส่งข้อมูลกลับ
    return NextResponse.json(completedOrders, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching completed orders:", error);

    return NextResponse.json(
      { error: error.message || "Failed to fetch completed orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // ตรวจสอบการเข้าสู่ระบบ
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = session.user.id;

    // รับข้อมูลจาก Client
    const { items, paymentType } = await req.json();

    // สร้าง Order ใหม่
    const order = await prisma.order.create({
      data: {
        customerId,
        totalPrice: 0,
        status: OrderStatus.pending,
      },
    });

    let totalPrice = 0;

    // ประมวลผลสินค้าและอัปเดตสต็อก
    await Promise.all(
      items.map(async (item: { skewerId: number; quantity: number }) => {
        const skewer = await prisma.skewer.findUnique({
          where: { id: item.skewerId },
        });

        if (!skewer) throw new Error(`Skewer ${item.skewerId} not found`);
        if (skewer.quantity < item.quantity) {
          throw new Error(`Not enough stock for Skewer ${item.skewerId}`);
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

        // อัปเดตสต็อก
        await prisma.skewer.update({
          where: { id: item.skewerId },
          data: { quantity: skewer.quantity - item.quantity },
        });
      })
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { totalPrice },
    });

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { totalPrice },
      include: {
        orderItems: {
          include: {
            skewer: {
              select: {
                id: true,
                name: true,
                price: true,
                quantity: true,
              },
            },
          },
        },
      },
    });

    // ส่งข้อมูล Real-time ไปยัง 2 ช่องทาง
    await Promise.all([
      pusherServer.trigger("orders", "new-order", updatedOrder), // สำหรับหน้า Cashier
      pusherServer.trigger(`order-${order.id}`, "status-updated", updatedOrder), // สำหรับหน้า User
    ]);

    // สร้าง Bill และ Transaction
    const bill = await prisma.bill.create({
      data: {
        orderId: order.id,
        totalPrice,
        paymentType,
        cashierId: null,
      },
      include: {
        order: {
          include: {
            customer: true, // ดึงข้อมูลลูกค้าทั้งหมด
          },
        },
      },
    });

    const transaction = await prisma.transaction.create({
      data: {
        billId: bill.id,
        amountPaid: totalPrice,
        paymentType,
        cashierId: null,
      },
    });

    return NextResponse.json(
      {
        orderId: updatedOrder.id,
        totalPrice: updatedOrder.totalPrice,
        billId: bill.id,
        transactionId: transaction.id,
        status: updatedOrder.status,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
