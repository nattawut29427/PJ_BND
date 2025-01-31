
  import { PrismaClient } from "@prisma/client";
  import { NextResponse } from 'next/server';
  import bcrypt from 'bcrypt';

  const prisma = new PrismaClient();

  export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const email = searchParams.get("email"); 
      const count = searchParams.get("count");
      
      if (count) {
        const totalUsers = await prisma.user.count();
        return NextResponse.json({ total: totalUsers });
      }
  
      if (email) {
        const user = await prisma.user.findUnique({
          where: { email },
          select: { email: true },
        });
  
        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
  
        return NextResponse.json(user);
      }
  
      
      const users = await prisma.user.findMany({
        orderBy: { id: "asc" },
      });
      
      return NextResponse.json(users);
    } catch (error) {
     
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
      if (!body || typeof body !== "object" || !body.email) {
        return NextResponse.json(
          { error: "Invalid input data: email is required" },
          { status: 400 }
        );
      }

      const { email, name, password, roles } = body;
      const hashedPassword = password ? bcrypt.hashSync(password, 10) : undefined;


      // if (isNaN(parsedId)) {
      //   return NextResponse.json(
      //     { error: "Invalid id: id must be a number" },
      //     { status: 400 }
      //   );
      // }

      // ค้นหา Skewer ในฐานข้อมูล
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }


      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          name: name !== undefined ? name : user.name,  
          password: hashedPassword !== undefined ? hashedPassword : user.password, 
          role: roles !== undefined ?  roles : user.role, 
        },
      });

      // ส่งกลับ response สำเร็จ
      return NextResponse.json(
        { message: "User updated successfully", data: updatedUser },
        { status: 200 }
      );
    } catch (error) {
      // Log ข้อผิดพลาด
      if (error instanceof Error) {
        console.error("Error updating user:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }

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