import { useCallback, useEffect, useState } from "react";
import { CartItem as CartItemType } from "@/types/cartitem"
import { Product as ProductType } from "@/types/product";

type OrderItemInfo = {

} | undefined;

export default function useCartItemInfo(cartItems: CartItemType[]): [OrderItemInfo[], boolean] {
    const [data, setData] = useState<OrderItemInfo[]>([]);
    const [loaded, setLoaded] = useState(false);

    const fetchProducts = useCallback(async () => {
        return Promise.all(cartItems.map(async item => {
            const res = await fetch(`/api/products?id=${item.id}`);
            if (!res.ok) return undefined;

            const product: ProductType = await res.json();
            return getProductDetails(product, item);
        }));
    }, [cartItems]);

    useEffect(() => {
        fetchProducts().then(data => {
            setData(data)
            setLoaded(true);
        });
    }, [cartItems]);

    return [data, loaded]
}

const getProductDetails = (product: ProductType, cartItem: CartItemType): OrderItemInfo => {
    if (product._hasVariants != (cartItem.variant != null)) return undefined;

    if (product._hasVariants) {
        const variant = product.variants.find((variant) => variant._specId == cartItem.variant);
        if (variant == undefined) return undefined;

        return {
            ...cartItem,
            name: product.name,
            variantName: variant.name,
            price: variant.price,
            image: variant.image
        };
    }

    return {
        ...cartItem,
        name: product.name,
        variantName: null,
        price: product.price,
        image: product.image
    };
}