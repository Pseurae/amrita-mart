export type CartItemInfo = {
    id: string;
    variantId: string | null;
    quantity: number,
    name: string;
    variantName: string | null;
    price: number;
    image: string;
};