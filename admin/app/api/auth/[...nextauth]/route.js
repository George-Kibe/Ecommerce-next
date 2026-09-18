import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Next 16 only allows HTTP handlers (and route config) to be exported from a
// route file — `authOptions` and `isAdminRequest` now live in @/lib/auth.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
