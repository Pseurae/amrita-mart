import { NextRequest, NextResponse } from "next/server";
import { getCakeOrder } from "./_lib/cakeorders";
import { UUID } from "crypto";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    return NextResponse.json(getCakeOrder(searchParams.get("id")!));
}