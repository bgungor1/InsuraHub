import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'Authentication';
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value || request.cookies.get('token')?.value;

    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!token && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        if (pathname !== '/') {
            loginUrl.searchParams.set('redirect', pathname);
        }
        return NextResponse.redirect(loginUrl);
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (token && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [

        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};