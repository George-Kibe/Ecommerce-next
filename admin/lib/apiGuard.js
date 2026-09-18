import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

/**
 * Wraps a route handler so it only runs for an authenticated admin.
 * Everyone else gets a flat 401 with no detail about why.
 */
export function withAdmin(handler) {
  return async (request, context) => {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, context);
  };
}

/**
 * Logs the real error server-side and returns a generic message, so database
 * and driver internals never reach the client.
 */
export function serverError(error, context) {
  console.error(`[api] ${context}:`, error);
  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 }
  );
}

export function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}
