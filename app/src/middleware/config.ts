import { NextRequest, NextResponse } from 'next/server';
import { default as Authorization, matcher as AuthorizationMatcher } from './authorization'

interface MiddlewareType {
    middleware: (req: NextRequest) => Promise<NextResponse>;
    matcher?: string | null | undefined;
}

export const middleware: MiddlewareType[] = [
    {
        middleware: Authorization,
        matcher: AuthorizationMatcher
    }
];