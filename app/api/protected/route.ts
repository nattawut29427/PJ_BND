// app/api/protected/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // import options ที่คุณตั้งไว้ใน authOptions.ts

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);  // ดึง session จาก server-side

  if (!session) {
    return new Response("Not authorized", { status: 401 });
  }

  return new Response(JSON.stringify({ message: "You are authorized", user: session.user }), {
    status: 200,
  });
}
