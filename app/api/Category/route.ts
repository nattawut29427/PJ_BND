// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const category = await prisma.category.findMany();
   
//     return new Response(JSON.stringify(category), { status: 200 });
 
    
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Unable to fetch skewer' }), { status: 500 });
//   }
// }

// export async function POST(req: any) {
//   try {
//     const body = await req.json();
//     const { name } = body;

//     if (!name) {
//       return new Response(JSON.stringify({ error: 'Name' }), { status: 400 });
//     }

//     const newCategory = await prisma.category.create({
//       data: { name },
//     });

//     return new Response(JSON.stringify(newCategory), { status: 201 });
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Unable to create Category' }), { status: 500 });
//   }
// }
