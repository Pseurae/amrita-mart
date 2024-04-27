import { CartItem } from "@/types/cartitem";

export type CartItemInfo = CartItem & {
    name: string;
    variantName: string | null;
    price: number;
    image: string;
} | undefined;