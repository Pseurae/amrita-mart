import { NextRequest } from "next/server";
import { getProductDetails, getProductFiles } from "./_lib/products"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    if (searchParams.has('search'))
        return Response.json(getProductDetails(searchParams.get('search')!));

    const fileNames = getProductFiles();
    return Response.json(fileNames.map((fname) => getProductDetails(fname)));
}