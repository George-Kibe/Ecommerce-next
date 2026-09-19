import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

/**
 * Who is allowed into the admin. Set ADMIN_EMAILS as a comma-separated list.
 * Anyone not on the list is rejected at sign-in, before a session is issued.
 *
 * An empty list fails CLOSED: `includes()` is false for everyone, so nobody
 * gets in. This used to throw at import time instead, which added no safety
 * (nobody was getting in either way) but turned a missing *runtime* setting
 * into a failed *build* — `next build` imports this module while collecting
 * page data, so every deploy died before it could even report the problem.
 * The misconfiguration is now reported at request time (log + sign-in page).
 */
export const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

/** False when ADMIN_EMAILS is empty — nobody can sign in until it's set. */
export const adminAccessConfigured = adminEmails.length > 0;

let warned = false;
function warnIfUnconfigured() {
  if (adminAccessConfigured || warned) return;
  warned = true;
  console.error(
    "[auth] ADMIN_EMAILS is empty — every sign-in will be refused. " +
      "Set it (comma-separated) in the deployment environment and redeploy."
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
      warnIfUnconfigured();
      return adminEmails.includes(user?.email?.toLowerCase());
    },
    session({ session }) {
      return session;
    },
  },
});

/** True when the caller holds a valid session for an allowlisted admin. */
export async function isAdmin() {
  warnIfUnconfigured();
  const session = await auth();
  return adminEmails.includes(session?.user?.email?.toLowerCase());
}
