import { PrismaClient } from '@prisma/client';
import { ourFileRouter } from "@/app/api/uploadthing/core"
import { NextResponse } from 'next/server';

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
    return new Response("Failed to save data", { status: 500 });
  }
}


export async function GET() {
  try {
    const skewer = await prisma.skewer.findMany();
    return new Response(JSON.stringify(skewer), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unable to fetch skewer' }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, price, categoryId, images, quantity } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
    }

    // ตรวจสอบว่าข้อมูลใหม่ไม่ทำให้ quantity ติดลบ
    if (quantity !== undefined && quantity < 0) {
      return new Response(JSON.stringify({ error: "Quantity cannot be negative" }), { status: 400 });
    }

    const updatedSkewer = await prisma.skewer.update({
      where: { id },
      data: {
        name,
        price,
        categoryId,
        images,
        quantity,
      },
    });

    return new Response(JSON.stringify(updatedSkewer), { status: 200 });
  } catch (error) {
    console.error("Error updating skewer:", error);
    return new Response(JSON.stringify({ error: "Unable to update skewer" }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
    }

    await prisma.skewer.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: 'Skewer deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting skewer:', error);
    return new Response(JSON.stringify({ error: 'Unable to delete skewer' }), { status: 500 });
  }
}


export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, quantityChange } = body; // `quantityChange` ใช้เพิ่มหรือลดจำนวนสินค้า

    if (!id || typeof quantityChange !== "number") {
      return new Response(JSON.stringify({ error: "Invalid input data" }), { status: 400 });
    }

    // ค้นหา Skewer ในฐานข้อมูล
    const skewer = await prisma.skewer.findUnique({
      where: { id },
    });

    if (!skewer) {
      return new Response(JSON.stringify({ error: "Skewer not found" }), { status: 404 });
    }

    // คำนวณจำนวนใหม่
    const newQuantity = skewer.quantity + quantityChange;

    if (newQuantity < 0) {
      return new Response(JSON.stringify({ error: "Insufficient quantity" }), { status: 400 });
    }

    // อัปเดตจำนวนสินค้า
    const updatedSkewer = await prisma.skewer.update({
      where: { id },
      data: { quantity: newQuantity },
    });

    return new Response(JSON.stringify(updatedSkewer), { status: 200 });
  } catch (error) {
    console.error("Error updating skewer quantity:", error);
    return new Response(JSON.stringify({ error: "Unable to update skewer quantity" }), { status: 500 });
  }
}