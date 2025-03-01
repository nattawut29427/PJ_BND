"use client";
import { signIn } from "next-auth/react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import logo from "@/public/logo.png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  // เมื่อ session มีการเปลี่ยนแปลง (หลังจาก login สำเร็จ) ให้ redirect ตาม role
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      setLoading(false);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/redirect-handler"); // ให้ redirect-handler จัดการต่อ
      }
    },
    [email, password, router]
  );

  const handleGoogleSignIn = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = signIn("google", { callbackUrl: "/redirect-handler" });

    setLoading(false);

    if (result?.error) {
      setError("Google login failed! Please try again.");
    }
    // useEffect จะจัดการ redirect หลังจาก session อัปเดต
  }, [router]);

  return (
    <>
      <div className="flex flex-wrap min-h-screen w-full content-center justify-center bg-red-950 py-10">
        <div className="flex shadow-md">
        <div className="flex flex-wrap content-center justify-center rounded-l-md w-96 h-[32rem] bg-white">
            <Image
              src={logo} // Use the imported logo variable
              alt="Logo"
              className="w-fit h-fit object-cover rounded-r-md"
            />
          </div>
          <div className="flex flex-wrap content-center justify-center rounded-r-md bg-white w-96 h-[32rem]">
            <div className="w-72">
              <h1 className="text-3xl font-bold text-center text-red-500 mb-8">
                Sign In
              </h1>

              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                    className="w-full p-2 border rounded-md text-lg font-medium bg-white text-gray-600"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="w-full p-2 border rounded-md text-lg font-medium bg-white text-gray-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full p-2 bg-red-500 text-white text-lg font-semibold rounded-md"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="flex divider text-sm font-semibold justify-center items-center mt-2 text-gray-400">
                or
              </div>

              <div className="mt-2 text-center border rounded-md border-gray-400">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full p-2 bg-white text-gray-700 font-semibold rounded-md text-lg "
                >
                  <i className="fa-brands fa-google mr-3"></i>
                  {loading ? "Google..." : "Google"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SignIn;
