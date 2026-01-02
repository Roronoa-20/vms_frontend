import { NextRequest, NextResponse } from 'next/server';
import {frappeAuthMiddleware} from '../middleware/frappeAuthMiddleware';

export async function middleware(req:any) {
    const response = NextResponse.next();
    await frappeAuthMiddleware(req, response, () => {});
    
    console.log("this is middleware user")

    if (req.pathname === '/login' || req.pathname === '/') {
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
     matcher: ["/((?!api/login|_next|login|vendor-details-form|.*\\..*).*)"],
};
