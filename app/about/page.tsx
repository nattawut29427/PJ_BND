// app/about/page.tsx
'use client';
import { useSession, signOut } from "next-auth/react"; // นำเข้า useSession และ signOut
import { title } from "@/components/primitives";

export default function AboutPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please log in to see the content.</div>;
  }

  return (
    <div>
      <h1 className={title()}>About</h1>
      <div>
        <h2>Welcome, {session?.user?.name}</h2>
        <p>Email: {session?.user?.email}</p>
        <img src={session?.user?.image || "/default-profile.jpg"} alt="Profile" width={100} height={100} />
      </div>
      {/* ปุ่ม Sign Out */}
      <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
    </div>
  );
}
