import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
2
export { handler as GET, handler as POST };