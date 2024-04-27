import { NextRequest, NextResponse } from "next/server";
import {Products} from '@/libs/orders'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const data = await request.json();
    const id = Products.placeOrder({ items: data });
    return NextResponse.json({ id }, { status: 200 });
}
