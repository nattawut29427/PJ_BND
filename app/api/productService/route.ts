import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req:any) {
  try {
    const body = await req.json(); // รับข้อมูล JSON จาก request body
    const { name, price, categoryId, images, quantity } = body;


    if (!name) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 400 });
    }

    const newskewer = await prisma.skewer.create({
      data: {
        name,
        price, 
        categoryId, 
        images, 
        quantity
    
      },
    });

    return new Response(JSON.stringify(newskewer), { status: 201 });
  } catch (error) {
    console.error('Error creating Category:', error);
    return new Response(JSON.stringify({ error: 'Unable to create Category' }), { status: 500 });
  }
}

