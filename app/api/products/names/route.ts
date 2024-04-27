import { getProductFiles } from "../libs/products"

export const dynamic = 'force-dynamic'

export async function GET() {
    const fileNames = getProductFiles();
    return Response.json(fileNames.map((i) => (i.endsWith('.toml') ? i.substring(0, i.length - 5) : i)));
}