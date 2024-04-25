import { getSessionFromToken } from "@/libs/session";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const token = request.headers.get("token");
    if (token == null) return NextResponse.json({}, { status: 404 });

    const session = getSessionFromToken(token);
    if (session == undefined) return NextResponse.json({}, { status: 404 });

    return NextResponse.json(session, { status: 200 });
}