import path from "path";
import fs from 'fs';
import { parse } from '@iarna/toml';
import { Product as ProductType } from "@/types/product";

export const PRODUCTS_FOLDER = path.join(process.cwd(), "products");

const getFilePath = (id: string) => {
    const hasExt = id.endsWith('.toml');
    const fileName = hasExt ? id : id + '.toml';
    if (hasExt) id = id.substring(0, id.length - 5);

    return path.join(PRODUCTS_FOLDER, fileName);
}

export const getProductFiles = () => {
    const files = fs.readdirSync(PRODUCTS_FOLDER);
    return files;
}

export const getProductDetails = (id: string) : ProductType | undefined => {
    const filePath = getFilePath(id);

    try {
        const tomlData = fs.readFileSync(filePath, 'utf8');
        const json = parse(tomlData);

        const hasVariants = "variants" in json;

        if (hasVariants)
        {
            const variants = json["variants" as const];
            const mappedVariants = Object.keys(variants).map((k) => {
                return { _specId: k, ...((variants as any)[k] as object) }
            });

            return { ...json, _id: id, _hasVariants: hasVariants, variants: mappedVariants } as ProductType;
        }

        return { ...json, _id: id, _hasVariants: hasVariants } as ProductType;
    } catch (err) {
        return undefined;
    }
}
