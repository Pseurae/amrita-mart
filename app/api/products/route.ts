import { NextRequest } from "next/server";
import { getProductDetails, getProductFiles } from "./libs/products"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    if (searchParams.has('id'))
        return Response.json(getProductDetails(searchParams.get('id')!));

    const fileNames = getProductFiles();
    return Response.json(fileNames.map((fname) => getProductDetails(fname)));
}