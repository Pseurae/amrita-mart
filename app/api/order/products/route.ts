import { NextRequest, NextResponse } from "next/server";
import { getProductOrder } from "./_lib/products";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    return NextResponse.json(getProductOrder(searchParams.get("id")!));
}