import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJWTPayload, getRoleWeight } from "./lib/utils";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { Role } from "./lib/constants";

const intlMiddleware = createMiddleware(routing);
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRootPage = pathname.endsWith('/admin') || pathname.endsWith('/admin/');
  const isAdminLoginPage = pathname.endsWith('/admin/login');
  const isAdminPage = pathname.includes('/admin');


  const refreshToken = request.cookies.get('refreshToken')?.value;
  const accessToken = request.cookies.get('accessToken')?.value;

  if (isAdminPage) {
    try {
      const refreshPayload = decodeJWTPayload(refreshToken!);
      const accessPayload = decodeJWTPayload(accessToken!);
      const exp = refreshPayload.exp;
      const role = accessPayload.role;
      const now = Math.floor(Date.now() / 1000);
      
      if (exp < now || getRoleWeight(role) < Role.STAFF.weight) throw new Error("Token expired");

      if (isAdminRootPage || isAdminLoginPage) {
        const locale = pathname.split('/')[1] || routing.defaultLocale;
        const admin = new URL(`/${locale}/admin/dashboard`, request.url);
        return NextResponse.redirect(admin);
      }

    } catch (error) {
      console.error("Middleware error:", error);
      if (isAdminLoginPage) {
        return NextResponse.next();
      }
      const locale = pathname.split('/')[1] || routing.defaultLocale;
      const login = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(login);
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
