import { NextRequest, NextResponse } from "next/server";
import { CakeOrder, createNewCakeOrder } from "../_lib/cakeorders";

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const data: CakeOrder = await request.json();
    const id = createNewCakeOrder(data);
    return NextResponse.json({ ...data, id });
}