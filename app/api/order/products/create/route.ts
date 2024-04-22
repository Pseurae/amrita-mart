import { NextRequest, NextResponse } from "next/server";
import { createNewProductOrder } from "../_lib/products";
import { CartItem } from "@/types/cartitem";

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const data = await request.json();
    const id = createNewProductOrder(data);
    return NextResponse.json({ id });
}
