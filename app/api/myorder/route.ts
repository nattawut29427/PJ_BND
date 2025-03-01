import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"; 

export async function GET(_req: Request) {
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const orders = await prisma.order.findMany({
        where: {
          customerId: session.user.id,
        },
        include: {
          orderItems: {
            include: {
              skewer: true, // ดึงข้อมูลสินค้า (Skewer)
            },
          },
        },
        orderBy: {
          orderDate: "desc",
        },
      });
  
      return NextResponse.json(orders);
    } catch (error) {
     
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }