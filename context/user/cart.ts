import { CartItem } from "@/types/cartitem";

export class Cart {
    readonly items: CartItem[];
    setItems: (val: CartItem[]) => void;

    constructor(items: CartItem[], setItems: (val: CartItem[]) => void) {
        this.items = items;
        this.setItems = setItems;
    }

    addItem(itemId: string, itemVariant: string | null, quantity: number) {
        const isItemInCart = this.items.find((cartItem) => (cartItem.id == itemId && cartItem.variant == itemVariant));

        if (isItemInCart) {
            this.setItems(
                this.items.map((item) => (
                    item.id == itemId && item.variant == itemVariant ?
                        { ...item, quantity: item.quantity + quantity } : item
                ))
            );
        } else {
            this.setItems([...this.items, { id: itemId, variant: itemVariant, quantity }]);
        }
    };

    removeItem(itemId: string, itemVariant: string | null = null, stack: boolean = false) {
        const isItemInCart = this.items.find((item) => (item.id == itemId && item.variant == itemVariant));
        if (isItemInCart === undefined) return;

        if (isItemInCart.quantity == 1 || stack) {
            this.setItems(this.items.filter((item) => item.id != itemId || item.variant != itemVariant));
        } else {
            this.setItems(
                this.items.map((item) => (
                    item.id == itemId && item.variant == itemVariant ?
                        { ...item, quantity: item.quantity - 1 } : item
                ))
            );
        }
    };

    clear() {
        this.setItems([]);
    }

    checkQuantity(itemId: string, itemVariant: string | null) {
        const item = this.items.find((item) => (item.id == itemId && item.variant == itemVariant));
        if (item === undefined) return 0;
        return item.quantity;
    }

    getItemCount() { return this.items.length; }
}