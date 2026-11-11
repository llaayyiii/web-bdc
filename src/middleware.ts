import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati file statis, aset Next.js, dan logo
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname === "/logo.svg" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("bdc_session");
  let session = null;
  if (sessionCookie && sessionCookie.value) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      session = null;
    }
  }

  const isAuthenticated = !!session;
  const isAdmin = session?.role === "admin" || session?.role === "instructor";

  // Halaman publik yang selalu bisa diakses tanpa login
  if (pathname === "/verify" || pathname.startsWith("/verify/")) {
    return NextResponse.next();
  }

  // Jika belum login dan mencoba masuk ke rute terproteksi
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/assessments") ||
    pathname.startsWith("/certificates") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/admin");

  if (!isAuthenticated && isProtectedPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login dan mencoba mengakses /login
  if (isAuthenticated && pathname === "/login") {
    const target = isAdmin ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Proteksi khusus rute /admin untuk non-admin
  if (isAuthenticated && pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
