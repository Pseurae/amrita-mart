import path from "path";
import fs from 'fs';
import { parse, stringify } from '@iarna/toml';
import { Product as ProductType } from "@/types/product";

export const PRODUCTS_FOLDER = path.join(process.cwd(), "products");

export const getProductFiles = () => {
    const files = fs.readdirSync(PRODUCTS_FOLDER);
    return files;
}

export const getProductDetails = (id: string) : ProductType | null => {
    const hasExt = id.endsWith('.toml');
    const fileName = hasExt ? id : id + '.toml';
    if (hasExt) id = id.substring(0, id.length - 5);

    const filePath = path.join(PRODUCTS_FOLDER, fileName);

    try {
        const tomlData = fs.readFileSync(filePath, 'utf8');
        let json = parse(tomlData);

        const hasVariants = "variants" in json;

        if (hasVariants)
        {
            const variants = json["variants" as const];
            const mappedVariants = Object.keys(variants).map((k) => {
                return { _specId: k, ...((variants as any)[k] as object) }
            });

            json = {...json, variants: mappedVariants };
        }

        return { ...json, _id: id, _hasVariants: hasVariants } as ProductType;
    } catch (err) {
        return null;
    }
}

export const createProductRecord = (details: ProductType) => {
    const filePath = path.join(PRODUCTS_FOLDER, details._id + '.toml');
    fs.writeFileSync(filePath, stringify(details));
}