import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const data = await request.json();
    return NextResponse.json(data);
}