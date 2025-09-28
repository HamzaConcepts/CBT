import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Use client-side auth guards for better performance
// Middleware is kept minimal to avoid server-side auth checks that slow down every request

export async function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/settings/:path*", "/dashboard/:path*", "/teacher/:path*", "/student/:path*"],
}


