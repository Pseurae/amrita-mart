import { NextRequest, NextResponse } from "next/server";
import { updateUser } from "../_lib/users";
import { User } from "@/types/user";

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const data = await request.json() as User;
    updateUser(data);
    return NextResponse.json(data);
}