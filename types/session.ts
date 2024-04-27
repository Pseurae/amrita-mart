import { CartItem } from "./cartitem";

export interface Session {
    currentCart: CartItem[];
    cakeOrders: string[];
    productOrders: string[];
};
