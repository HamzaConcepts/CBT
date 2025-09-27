import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple client-side guarded routes can be handled in-page, but we add a
// basic middleware to prevent access to authenticated pages when no session.

export async function middleware(req: NextRequest) {
  // Disable cookie-based auth gating; use client-side guards instead
  return NextResponse.next()
}

export const config = {
  matcher: ["/settings", "/dashboard"],
}


