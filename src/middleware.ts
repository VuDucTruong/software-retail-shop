import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJWTPayload } from "./lib/utils";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAdminLoginPage = pathname.endsWith('/admin/login');
  const isProtectedRoute = (pathname.startsWith('/vi/admin') || pathname.startsWith('/en/admin')) && !isAdminLoginPage;

  const token = request.cookies.get('refreshToken')?.value;

  if (isProtectedRoute) {
    try {
      const payload = decodeJWTPayload(token!);
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      if (exp < now) throw new Error("Token expired");
    } catch (err) {
      const locale = pathname.split('/')[1] || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}


export const config = {
  matcher: [
    '/', 
    '/(vi|en)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};
