"use client"

import { CartItem } from "@/types/cartitem";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// const useLocalCart = (): [CartItem[], Dispatch<SetStateAction<CartItem[]>>, boolean] => {
//     const [cart, setCart] = useState<CartItem[]>([]);
//     const [loadedCart, setLoadedCart] = useState(false);

//     const {data: fetchedCart, isLoading: loadingCart} = useSWR('/api/localcart/load/', (s: string) => fetch(s).then(res => res.json()));

//     useEffect(() => {
//         if (fetchedCart) setCart(fetchedCart);
//         setLoadedCart(true);
//     }, [fetchedCart]);

//     useEffect(() => {
//         if (!loadedCart) return;

//         fetch('/api/localcart/save/', {
//             method: 'POST',
//             body: JSON.stringify(cart),
//         })
//     }, [cart]);

//     return [cart, setCart, loadedCart];
// };

const useLocalCart = (): [CartItem[], Dispatch<SetStateAction<CartItem[]>>, boolean] => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loadedCart, setLoadedCart] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem('localCartItems');
        if (data) setCart(JSON.parse(data));
        setLoadedCart(true);
    }, []);

    useEffect(() => {
        if (loadedCart) localStorage.setItem('localCartItems', JSON.stringify(cart));
    }, [cart]);

    return [cart, setCart, loadedCart];
};

export default useLocalCart;
