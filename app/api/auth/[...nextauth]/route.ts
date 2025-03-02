import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
ะำหะ
export { handler as GET, handler as POST };