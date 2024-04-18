import { UserRegister } from "@/app/_types/user";
import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "../_lib/users";

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const data = await request.json() as UserRegister;
    return NextResponse.json(registerUser(data));
}