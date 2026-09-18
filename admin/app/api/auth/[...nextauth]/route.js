import { handlers } from "@/lib/auth";

// Auth.js v5 builds the route handlers from the shared config in @/lib/auth.
// A route file may only export HTTP handlers, so everything else lives there.
export const { GET, POST } = handlers;
