import { NextRequest, NextResponse } from "next/server";
import {Products} from '@/libs/orders'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    return NextResponse.json(Products.getOrder(searchParams.get("id")!));
}