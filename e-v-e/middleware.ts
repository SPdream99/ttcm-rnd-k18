import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root redirect logic: "localhost:3000" (/) -> redirect to appropriate dashboard based on cookie
  if (pathname === "/") {
    const authCookie = request.cookies.get("eve_auth_user");
    if (authCookie && authCookie.value) {
      try {
        const rawValue = authCookie.value;
        const user = JSON.parse(decodeURIComponent(rawValue));

        if (user && user.role) {
          if (user.role === "teacher") {
            if (user.status === "pending") {
              return NextResponse.redirect(new URL("/public/pending", request.url));
            }
            return NextResponse.redirect(new URL("/dashbroad/teacher", request.url));
          } else if (user.role === "school" || user.role === "admin") {
            return NextResponse.redirect(new URL("/dashbroad/school", request.url));
          } else {
            // Default: student dashboard
            return NextResponse.redirect(new URL("/dashbroad/student", request.url));
          }
        }
      } catch (e) {
        console.error("Middleware parsing auth cookie error:", e);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
