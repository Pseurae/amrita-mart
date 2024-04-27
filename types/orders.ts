import { CartItem } from "./cartitem";

interface BaseOrder {
    date: number;
};

export interface CakeOrder {
    type: string;
    message: string;
    quantity: number;
    need_candles: boolean;
    other_request: string;
};

export interface ProductOrder {
    items: CartItem[];
};

export type WithDate<T> = T & BaseOrder;