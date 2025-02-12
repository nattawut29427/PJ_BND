"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RedirectHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // รอให้ session โหลดเสร็จก่อน
    if (!session) {
      router.push("/signin"); // ถ้าไม่มี session ให้กลับไปหน้า Sign In
      return;
    }

    // ตรวจสอบ role ของผู้ใช้ แล้ว redirect ไปยังหน้าที่เหมาะสม
    const role = session.user?.role;
   
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "cashier") {
      router.push("/cashier");
    } else {
      router.push("/"); // ลูกค้าธรรมดาไปหน้าแรก
    }
  }, [session, status, router]);

}
