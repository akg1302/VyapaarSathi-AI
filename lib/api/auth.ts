import { UnauthorizedError } from "./errors";
/** Temporary development identity. Replace with `supabase.auth.getUser()` once auth is connected. */
export function getRequestUserId(request: Request) { const userId = request.headers.get("x-user-id") ?? process.env.DEV_USER_ID; if (!userId) throw new UnauthorizedError(); return userId; }
