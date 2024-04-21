import path from "path";
import fs from 'fs';
import { parse, stringify } from '@iarna/toml';
import { randomUUID } from "crypto";
import { CartItem } from "../../../../_types/cartitem";

export const PRODUCTORDERS_FOLDER = path.join(process.cwd(), "orders", "products");

export const createNewProductOrder = (order: CartItem[]): string => {
    if (!fs.existsSync(PRODUCTORDERS_FOLDER)) {
        fs.mkdirSync(PRODUCTORDERS_FOLDER, { recursive: true });
    }

    const id = randomUUID();
    const filePath = path.join(PRODUCTORDERS_FOLDER, id + ".toml");

    fs.writeFileSync(filePath, stringify({ order, date: new Date().getTime() } as any), 'utf-8');

    return id;
}


export const getProductOrder = (id: string) => {
    const filePath = path.join(PRODUCTORDERS_FOLDER, id + ".toml");
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return parse(data);
    } catch (e) {
        return null;
    }
}