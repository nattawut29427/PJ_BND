"use client";
import { signIn } from "next-auth/react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null); 
      const result = await signIn("credentials", {
        redirect: fals  e,
        email,
        password,
      });

      setLoading(false);

      if (result?.error) {
        setError(result.error); 
      } else {
       
        router.push("/");
      }
    },
    [email, password, router]
  );

  const handleGoogleSignIn = useCallback(
    async () => {
      setLoading(true);
      setError(null); // Clear previous error message

      const result = await signIn("google", {
        redirect: false, // Don't redirect immediately
      });

      setLoading(false);

      if (result?.error) {
        setError("Google login failed! Please try again.");
      } else {
        // Redirect after successful Google login
      }
    },
    [router]
  );

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold text-center mb-4">Sign In</h1>

      {/* Error message display */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Credentials form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded-md"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Google SignIn button */}
      <div className="mt-4 text-center">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full p-2 bg-red-500 text-white rounded-md"
        >
          {loading ? "Signing In with Google..." : "Sign In with Google"}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
