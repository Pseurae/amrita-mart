import { saveSessionForToken } from "@/libs/session";
import { Session } from "@/types/session";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const token = request.headers.get("token");
    if (token == null) return NextResponse.json({}, { status: 404 });

    const session = await request.json() as Session;
    if (!session) return NextResponse.json({}, { status: 404 });

    saveSessionForToken(token, session);

    return NextResponse.json({}, { status: 200 });
}