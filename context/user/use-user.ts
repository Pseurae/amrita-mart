"use client"

import { CartItem } from "@/types/cartitem";
import { User } from "@/types/user";
import { useEffect, useRef, useState } from "react";
import { Cart } from "./cart";

export enum LocalCartTransfer {
    REPLACE,
    APPEND,
    SKIP
};

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loadedUser, setLoadedUser] = useState(false);

    const [localCart, setLocalCart] = useState<CartItem[]>([]);
    const [loadedCart, setLoadedCart] = useState(false);

    const rememberMe = useRef(false);
    const [cartOpen, setCartOpen] = useState(false);

    const [showLoginModal, setShowLoginModal] = useState(false);

    const cartLoadAction = useRef(LocalCartTransfer.SKIP);

    // 
    const getCartItems = () => user ? user.currentCart : localCart;
    const setCartItems = (value: CartItem[]) => {
        if (user == null) setLocalCart(value);
        else setUser((user) => ({ ...user!, currentCart: value }));
    }

    // 
    useEffect(() => {
        const data = localStorage.getItem('localCartItems');
        if (data) setLocalCart(JSON.parse(data));
        setLoadedCart(true);
    }, []);

    useEffect(() => {
        if (loadedCart) localStorage.setItem('localCartItems', JSON.stringify(localCart));
    }, [localCart, loadedCart]);


    useEffect(() => {
        const data = sessionStorage.getItem('userSession');
        if (data) setUser(JSON.parse(data));
        setLoadedUser(true);
    }, []);

    useEffect(() => {
        if (loadedUser)
        {
            sessionStorage.setItem('userSession', JSON.stringify(user));
            
            if (user != null) {
                fetch('/api/users/update', {
                    method: 'POST',
                    body: JSON.stringify(user)
                });
            }
        }
    }, [user, loadedUser]);

    // 
    const addProductOrder = (id: string) => {
        if (user == null) throw new Error("User not logged in!");
        setUser((user) => ({ ...user!, productOrders: [...user!.productOrders, id] }));
    }

    const addCakeOrder = (id: string) => {
        if (user == null) throw new Error("User not logged in!");
        setUser((user) => ({ ...user!, cakeOrders: [...user!.cakeOrders, id] }))
    }

    const login = (user: User, rememberMe: boolean) => {
        const localCart_: CartItem[] = loadedCart ? localCart : (JSON.parse(localStorage.getItem('localCartItems')!) || []);

        // setRememberMe(rememberMe);
        if (localCart_.length == 0) {
            setUser(user);
            return;
        }

        switch (cartLoadAction.current) {
            case LocalCartTransfer.REPLACE:
                setUser({ ...user, currentCart: localCart_ });
                break;
            case LocalCartTransfer.APPEND:
                setUser({ ...user, currentCart: user.currentCart.concat(localCart_) })
                break;
            case LocalCartTransfer.SKIP:
                setUser(user);
                break;
        }

        setLocalCart([]);
    };

    const logout = () => {
        setUser(null);
    }

    const cart: Cart = new Cart(getCartItems(), setCartItems);

    return {
        user,
        login,
        logout,
        loadedUser,
        hasLoggedIn: user != null,
        isCartOpen: cartOpen,
        setCartOpen: (open: boolean) => setCartOpen(open),
        cartLoaded: loadedCart,
        showLoginModal, 
        setCartLoadAction: (action: LocalCartTransfer) => { cartLoadAction.current = action; },
        setShowLoginModal,
        getCartItems,
        cart,
        addProductOrder,
        addCakeOrder
    };
}

export type UserContextType = ReturnType<typeof useUser>;