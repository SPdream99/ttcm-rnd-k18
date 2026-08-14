import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read session cookie
  const authCookie = request.cookies.get("eve_auth_user");
  let user: {
    uid?: string;
    role?: string;
    status?: string;
    email?: string;
  } | null = null;

  if (authCookie && authCookie.value) {
    try {
      user = JSON.parse(decodeURIComponent(authCookie.value));
    } catch {
      user = null;
    }
  }

  const isLoggedIn = Boolean(user && user.role);
  const role = user?.role || "student";
  const status = user?.status || "active";

  // Helper to determine home dashboard based on role
  const getRoleDashboard = (userRole: string, userStatus: string) => {
    if (userRole === "admin" || userRole === "school") {
      return "/admin/dashboard";
    }
    if (userRole === "teacher") {
      if (userStatus === "pending") return "/pending";
      return "/teacher/dashboard";
    }
    return "/student/dashboard";
  };

  // 1. Backward compatibility & generic dashboard redirects
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL(getRoleDashboard(role, status), request.url));
  }
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL(getRoleDashboard(role, status), request.url));
  }
  if (pathname.startsWith("/dashboard/student")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }
  if (pathname.startsWith("/dashboard/teacher")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
  }
  if (pathname.startsWith("/dashboard/school") || pathname.startsWith("/dashboard/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  if (pathname === "/public/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname === "/public/register") {
    return NextResponse.redirect(new URL("/register", request.url));
  }
  if (pathname === "/public/pending") {
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  // 2. Root path ('/') redirect for authenticated users
  if (pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(getRoleDashboard(role, status), request.url));
    }
    return NextResponse.next();
  }

  // 3. Auth pages ('/login', '/register') when already logged in
  if (pathname === "/login" || pathname === "/register") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(getRoleDashboard(role, status), request.url));
    }
    return NextResponse.next();
  }

  // 4. Pending page ('/pending')
  if (pathname === "/pending") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role === "teacher" && status === "pending") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(getRoleDashboard(role, status), request.url));
  }

  // 5. Admin area ('/admin/*')
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "admin" && role !== "school") {
      // Non-admin trying to access admin area
      return NextResponse.redirect(new URL(getRoleDashboard(role, status), request.url));
    }
    return NextResponse.next();
  }

  // 6. Teacher area ('/teacher/*')
  if (pathname.startsWith("/teacher")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role === "teacher" && status === "pending") {
      return NextResponse.redirect(new URL("/pending", request.url));
    }
    if (role !== "teacher" && role !== "admin" && role !== "school") {
      return NextResponse.redirect(new URL(getRoleDashboard(role, status), request.url));
    }
    return NextResponse.next();
  }

  // 7. Student area ('/student/*')
  if (pathname.startsWith("/student")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/pending",
    "/dashboard",
    "/dashboard/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/public/:path*",
  ],
};

