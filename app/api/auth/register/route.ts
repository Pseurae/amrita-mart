import { registerUser } from "@/libs/auth";
import { UserPayload } from "@/types/user-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const data = await request.json() as UserPayload;
    return NextResponse.json(registerUser(data.username, data.fullname!, data.email, data.password), { status: 200 });
}