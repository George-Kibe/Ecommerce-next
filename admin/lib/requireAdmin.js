import { redirect } from "next/navigation";
import { auth, adminEmails } from "@/lib/auth";

/**
 * Server-side guard for admin pages. Returns the session, or redirects to the
 * sign-in page when the caller is not an allowlisted admin.
 *
 * proxy.js only checks that a session cookie exists; this verifies it.
 */
export default async function requireAdmin() {
  const session = await auth();

  if (!adminEmails.includes(session?.user?.email?.toLowerCase())) {
    redirect("/");
  }

  return session;
}
