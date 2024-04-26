import { invalidateToken } from "@/libs/user-token";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export function POST(request: NextRequest) {
    const token = request.headers.get("token");

    if (!token) return NextResponse.json({}, { status: 404 });

    invalidateToken(token);
    return NextResponse.json({}, { status: 200 });
}