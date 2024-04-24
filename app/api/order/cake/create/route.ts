import { NextRequest, NextResponse } from "next/server";
import { Cakes } from "@/libs/orders";
import { CakeOrder } from "@/types/orders";

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const data: CakeOrder = await request.json();
    const id = Cakes.placeOrder(data);
    return NextResponse.json({ ...data, id });
}