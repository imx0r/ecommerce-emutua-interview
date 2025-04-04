import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest): Promise<NextResponse> {
    return NextResponse.next();
}

export const matcher = '/administrar';