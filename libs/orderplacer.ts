import path from "path";
import fs from 'fs';
import { parse, stringify } from '@iarna/toml';
import { randomUUID } from "crypto";
import { WithDate } from "@/types/orders";

const ORDERS_DIR = path.join(process.cwd(), "data", "orders");

export class OrderPlacer<OrderType> {
    readonly ordersPath: string;

    constructor(orderFolder: string) {
        this.ordersPath = path.join(ORDERS_DIR, orderFolder);
    }

    public placeOrder(order: OrderType): string | undefined {
        if (!fs.existsSync(this.ordersPath)) {
            fs.mkdirSync(this.ordersPath, { recursive: true });
        }
    
        const id = randomUUID();
        const filePath = path.join(this.ordersPath, id + ".toml");
    
        fs.writeFileSync(filePath, stringify({ ...order, date: new Date().getTime() } as any), 'utf-8');
    
        return id;
    }

    public getOrder(id: string) : WithDate<OrderType> | undefined {
        const filePath = path.join(this.ordersPath, id + ".toml");
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return parse(data) as WithDate<OrderType>;
        } catch (e) {
            return undefined;
        }
    }
};