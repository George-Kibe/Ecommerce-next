import { NextResponse } from "next/server";

/**
 * Defence in depth for the admin UI. (Next 16 renamed the `middleware` file
 * convention to `proxy`.)
 *
 * The API routes each enforce admin access themselves (see lib/apiGuard.js) —
 * this only stops an unauthenticated browser from loading admin pages at all.
 * It checks for the presence of a session cookie, not its validity: validating
 * it needs the database, which this runtime cannot reach. The page and API
 * layers do the real check.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // API routes enforce their own auth and answer with JSON 401s. Redirecting
  // them here would hand API clients an HTML page instead of an error.
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // The root path renders the sign-in button, so it stays reachable.
  if (pathname === "/") return NextResponse.next();

  const hasSession =
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token");

  if (!hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
