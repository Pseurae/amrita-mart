import { CartItem } from "./cartitem";

interface BaseOrder {
    date: number;
};

export type CakeOrder = BaseOrder & {
    type: string;
    message: string;
    quantity: number;
    need_candles: boolean;
    other_request: string;
};

export type ProductOrder = BaseOrder & CartItem;