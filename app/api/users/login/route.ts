import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "../_lib/users";

export const dynamic = 'force-dynamic'

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const username = searchParams.get("username"),
        password = searchParams.get("password");

    if (!username || !password) return NextResponse.json(null);

    return NextResponse.json(loginUser(username, password));
}