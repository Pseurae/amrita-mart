import { loginUser } from "@/libs/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const username = searchParams.get("username"),
        password = searchParams.get("password");

    if (!username || !password) return NextResponse.json({}, { status: 404 });

    return NextResponse.json(loginUser(username, password), { status: 200 });
}