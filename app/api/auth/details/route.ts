import { getUser } from "@/libs/auth";
import { getDataForToken } from "@/libs/user-token";
import { User, UserDetails } from "@/types/user-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export function GET(request: NextRequest) {
    const token = request.headers.get("token");

    if (!token) return NextResponse.json({}, { status: 404 });

    const tokenData = getDataForToken(token);
    if (tokenData == undefined) return NextResponse.json({ message: "Token doesn't exist." }, { status: 404 });

    const user: User | undefined = getUser(tokenData.username);
    if (user == undefined) return NextResponse.json({ message: `Token exists, the tied user doesn't.` }, { status: 404 });

    const userDetails: UserDetails = {
        username: tokenData.username,
        email: user.email,
        fullname: user.fullname
    };

    return NextResponse.json(userDetails, { status: 200 });
}