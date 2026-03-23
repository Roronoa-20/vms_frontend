import { NextRequest, NextResponse } from 'next/server';
import { frappeAuthMiddleware } from '../middleware/frappeAuthMiddleware';

interface AuthenticatedRequest extends NextRequest {
    user?: any;
}

export async function middleware(req: AuthenticatedRequest) {
    const response = NextResponse.next();
    await frappeAuthMiddleware(req, response, () => { });

    const { pathname } = req.nextUrl;

    if (pathname === '/login' || pathname === '/material_login' || pathname === '/') {
        return response;
    }
    if (!req.user) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return response;
}

// Optional: Define route matching
export const config = {
    // matcher: ['/training_and_education'],
    // matcher: ['/awareness_program'],
    // matcher: ['/dashboard'],
    // matcher:["/((?!api/login|_next|login).*)"]
    matcher: ["/((?!api/login|_next|login|material_login|qms-form|vendor-details-form|.*\\..*).*)"],
};
