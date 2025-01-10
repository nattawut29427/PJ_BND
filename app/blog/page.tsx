'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // ใช้ next/navigation แทน next/router
import { useEffect, useState } from "react";

export default function BlogPage() {
  const { data: session } = useSession();
  const router = useRouter(); // ใช้ useRouter จาก next/navigation
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      if (session.user.role !== "admin") {
        router.push('/'); // Redirect ไปหน้าอื่นหากไม่ใช่ admin
      } else {
        setLoading(false); // หากเป็น admin ให้โหลดหน้า
      }
    }
  }, [session, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>Welcome, Admin!</div>
  );
}
