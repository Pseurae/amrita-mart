import path from "path";
import fs from 'fs';
import { parse, stringify } from '@iarna/toml';
import { randomUUID } from "crypto";

export const CAKEORDERS_FOLDER = path.join(process.cwd(), "orders", "cakes");

export type CakeOrder = {
    type: string;
    message: string;
    quantity: number;
    need_candles: boolean;
    other_request: string;
};

export const createNewCakeOrder = (order: CakeOrder): string => {
    if (!fs.existsSync(CAKEORDERS_FOLDER)) {
        fs.mkdirSync(CAKEORDERS_FOLDER, { recursive: true });
    }

    const id = randomUUID();
    const filePath = path.join(CAKEORDERS_FOLDER, id + ".toml");
    fs.writeFileSync(filePath, stringify(order), 'utf-8');

    return id;
}

export const getCakeOrder = (id: string): (CakeOrder | null) => {
    const filePath = path.join(CAKEORDERS_FOLDER, id + ".toml");
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return parse(data) as CakeOrder;
    } catch (e) {
        return null;
    }
}