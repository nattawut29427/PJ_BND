import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";



const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin", // กำหนดเส้นทางของหน้าล็อกอินที่ต้องการ
    error: "/auth/error", // กำหนดเส้นทางเมื่อเกิดข้อผิดพลาด
  },
  callbacks: {
    async signIn({ account, profile }) {
      // เพิ่ม log สำหรับ debug
      console.log("Account:", account);
      console.log("Profile:", profile);

      // ตรวจสอบว่า profile และ account มีข้อมูลหรือไม่
      if (!profile || !account) {
        console.error("Error: Missing profile or account information.");
        return false; // ปฏิเสธการเข้าสู่ระบบหากข้อมูลไม่สมบูรณ์
      }


      return true; // อนุญาตให้เข้าสู่ระบบ
    },
    async session({ session, user }) {
      // เพิ่มข้อมูลจาก user ใน session
      session.user = {
        ...session.user,
        id: user.id,
        email: user.email,
        name: user.name,
      };
      return session; // ส่งกลับ session ที่อัพเดทแล้ว
    },
    async redirect({ baseUrl }) {
      // กำหนด redirect หลังจากการล็อกอินสำเร็จ
    
      return baseUrl; // ส่งไปยังหน้าแรก (กรณีไม่ตรงกับ baseUrl)
    },
  },
  events: {
    async signIn(message) {
      console.log("User signed in:", message.user);
    },
    async signOut(message) {
      console.log("User signed out:", message);
    },
    async error(message) {
      console.error("Auth error:", message);
    },
  },
});

export { handler as GET, handler as POST };
