import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

/**
 * Who is allowed into the admin. Set ADMIN_EMAILS as a comma-separated list.
 * Anyone not on the list is rejected at sign-in, before a session is issued.
 */
export const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

if (adminEmails.length === 0) {
  throw new Error(
    "ADMIN_EMAILS is not set — refusing to start with an empty admin allowlist."
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "database" },
  pages: { error: "/" },
  callbacks: {
    /**
     * Reject non-admins here rather than in the session callback: this refuses
     * the sign-in outright instead of issuing a session we later have to
     * special-case.
     */
    signIn({ user }) {
      return adminEmails.includes(user?.email?.toLowerCase());
    },
    session({ session }) {
      return session;
    },
  },
});

/** True when the caller holds a valid session for an allowlisted admin. */
export async function isAdmin() {
  const session = await auth();
  return adminEmails.includes(session?.user?.email?.toLowerCase());
}
