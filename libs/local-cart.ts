import { CartItem } from "@/types/cartitem";
import path from "path";
import fs from "fs";
import { parse, stringify } from "@iarna/toml";

const LOCAL_CART_FILE = path.join("data", "local-cart.toml");

export function loadLocalCart() : CartItem[] {
    try {
        const data = fs.readFileSync(LOCAL_CART_FILE, 'utf-8');
        return (parse(data) as any).items as CartItem[] || [];
    } catch (e) {
        return [];
    }
}

export function saveLocalCart(items: CartItem[]) {
    if (!fs.existsSync(path.dirname(LOCAL_CART_FILE))) {
        fs.mkdirSync(path.dirname(LOCAL_CART_FILE), { recursive: true });
    }

    fs.writeFileSync(LOCAL_CART_FILE, stringify({ items } as any), 'utf-8');
}