import type { NextRequest } from 'next/server'
import { NextResponse } from "next/server";
import { middleware as Middlewares } from '@/middleware/config'

export async function middleware(req: NextRequest) {
    const middlewares = Middlewares
        .filter(m=> (!m.matcher || (!!m.matcher && new RegExp(m.matcher).test(req.nextUrl.toString()))))
        .map(m => m.middleware(req));

    for (const fn of middlewares) {
        const result = await fn;
        if (!result.ok) {
            return result;
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: "/((?!api|static|.*\\..*|_next).*)",
}