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

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, price, categoryId, images, quantity } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
    }

    const updatedSkewer = await prisma.skewer.update({
      where: { id },
      data: {
        name,
        price,
        categoryId,
        images,
        quantity
      },
    });

    return new Response(JSON.stringify(updatedSkewer), { status: 200 });
  } catch (error) {
    console.error('Error updating skewer:', error);
    return new Response(JSON.stringify({ error: 'Unable to update skewer' }), { status: 500 });
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


