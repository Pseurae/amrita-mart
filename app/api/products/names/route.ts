import { getProductFiles } from "../_lib/products"

export const dynamic = 'force-dynamic'

export async function GET() {
    const fileNames = await getProductFiles();
    return Response.json(fileNames.map((i) => (i.endsWith('.toml') ? i.substring(0, i.length - 5) : i)));
}