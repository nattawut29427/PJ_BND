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


