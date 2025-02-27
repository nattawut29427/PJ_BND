
import { DefaultUser } from "next-auth"; 

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    id: string;
    role: string;
  }


  interface DefaultUser {
    role: string;
  }
}
