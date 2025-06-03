import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

interface JWTPayload {
  id: number;
  role: "ADMIN" | "USER";
  email_verified_at?: string;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || null;
  const { pathname } = request.nextUrl;

  // تعريف الصفحات التي يجب حمايتها
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/customer/dashboard");

  // صفحات التسجيل والدخول - تأكد تضيف كل الصفحات المتعلقة بالتوثيق
  const isAuthPage =
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signin");

  if (token) {
    try {
      const decoded = jwtDecode<JWTPayload>(token);

      // منع USER من دخول صفحات الأدمن
      if (isAdminRoute && decoded.role === "USER") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      // منع أي مستخدم مسجل من دخول صفحات التسجيل أو الدخول
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error(error);
      // إذا التوكن غير صالح أو مفسر بشكل خاطئ، إعادة توجيه للتسجيل
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // المستخدم غير مسجل ويحاول دخول صفحات محمية (لوحات تحكم أو صفحات أدمن)
    if (isDashboardRoute || isAdminRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/register",
    "/login",
    "/signin",
  ],
};
