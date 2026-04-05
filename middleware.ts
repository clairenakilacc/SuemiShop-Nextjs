// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Toggle maintenance mode
const MAINTENANCE_MODE = false;

export function middleware(req: NextRequest) {
  if (MAINTENANCE_MODE && !req.nextUrl.pathname.startsWith("/maintenance")) {
    // Redirect all requests to /maintenance page
    return NextResponse.rewrite(new URL("/maintenance", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all paths
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
