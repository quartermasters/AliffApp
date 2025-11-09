import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/login", "/auth/signup", "/auth/error"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (req.auth?.user?.role !== "ADMIN" && req.auth?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
