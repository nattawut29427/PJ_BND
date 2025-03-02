import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const metadata = await req.json();

    const { name, price, spicyLevel, categoryId, quantity, fileUrl } = metadata;

    // บันทึกข้อมูลในฐานข้อมูล
    await prisma.skewer.create({
      data: {
        name,
        price: parseFloat(price),
        spicyLevel,
        images: fileUrl, // URL ของไฟล์
        categoryId: parseInt(categoryId),
        quantity: parseFloat(quantity),
      },
    });

    return new Response("Data saved successfully", { status: 200 });
  } catch (error) {
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const count = searchParams.get("count"); // เพิ่มตัวเลือก count

    if (id) {
      const skewer = await prisma.skewer.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!skewer) {
        return NextResponse.json(
          { error: "Skewer not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(skewer);
    }

    if (count) {
      const totalSkewers = await prisma.skewer.count();

      return NextResponse.json({ total: totalSkewers });
    }

    const skewers = await prisma.skewer.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(skewers);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // ลบข้อมูลในตาราง Sale ที่เชื่อมโยงกับ Skewer นี้
    // await prisma.sale.deleteMany({
    //   where: { skewerId: parseInt(id) },
    // });

    // ลบข้อมูลในตาราง Skewer
    await prisma.skewer.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Product and related sales deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // ตรวจสอบ request body
    if (!req.body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    // รับข้อมูลจาก request body
    const body = await req.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!body || typeof body !== "object" || !body.id) {
      return NextResponse.json(
        { error: "Invalid input data: id is required" },
        { status: 400 }
      );
    }

    const { id, name, price, categoryId, quantityChange } = body;

    // แปลง id เป็น integer
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: "Invalid id: id must be a number" },
        { status: 400 }
      );
    }

    // ค้นหา Skewer ในฐานข้อมูล
    const skewer = await prisma.skewer.findUnique({
      where: { id: parsedId },
    });

    if (!skewer) {
      return NextResponse.json({ error: "Skewer not found" }, { status: 404 });
    }

    // คำนวณจำนวนใหม่ (หากมี quantityChange)
    let newQuantity = skewer.quantity;

    if (typeof quantityChange === "number") {
      newQuantity = skewer.quantity + quantityChange;

      if (newQuantity < 0) {
        return NextResponse.json(
          { error: "Insufficient quantity" },
          { status: 400 }
        );
      }
    }

    // อัปเดตข้อมูลสินค้า (เฉพาะฟิลด์ที่ส่งมา)
    const updatedSkewer = await prisma.skewer.update({
      where: { id: parsedId },
      data: {
        name: name !== undefined ? name : skewer.name, // อัปเดตชื่อ (หากส่งมา)
        price: price !== undefined ? parseFloat(price) : skewer.price, // แปลง price เป็น float
        categoryId:
          categoryId !== undefined ? parseInt(categoryId) : skewer.categoryId, // อัปเดตหมวดหมู่ (หากส่งมา)
        quantity: newQuantity, // อัปเดตจำนวน (หากส่ง quantityChange)
      },
    });

    // ส่งกลับ response สำเร็จ
    return NextResponse.json(
      { message: "Product updated successfully", data: updatedSkewer },
      { status: 200 }
    );
  } catch (error) {
    // Log ข้อผิดพลาด
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } else {
      // ส่งกลับข้อความ error ที่ชัดเจน
      return NextResponse.json(
        {
          error:
            "Unable to update product: " +
            (error instanceof Error ? error.message : "Unknown error"),
        },
        { status: 500 }
      );
    }
  }
}
