"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CartItem } from "../_types/cartitem";
import { User } from "../_types/user";
import { act } from "react-dom/test-utils";

export enum LocalCartTransfer {
    REPLACE,
    APPEND,
    SKIP
};

type UserContextType = {
    user: User | null;
    login: (user: User, rememberMe: boolean) => void;
    logout: () => void;
    hasLoggedIn: boolean;

    setCartLoadAction: (action: LocalCartTransfer) => void;

    showLoginModal: boolean;
    setShowLoginModal: (v: boolean) => void;

    isCartOpen: boolean;
    setCartOpen: (v: boolean) => void;

    cartLoaded: boolean;
    getCartItems: () => CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string, itemVariant: string | null) => void;
    removeItemsFromCart: (itemId: string, itemVariant: string | null) => void;

    clearCart: () => void;
    getCartItemCount: () => number;
    checkQuantity: (itemId: string, itemVariant: string | null) => number;

    addProductOrder: (_: string) => void;
    addCakeOrder: (_: string) => void;
};

const UserContext = createContext<UserContextType>(null!);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [user, setUser] = useState<User | null>(null);
    const [loadedUser, setLoadedUser] = useState(false);

    const [localCart, setLocalCart] = useState<CartItem[]>([]);
    const [loadedCart, setLoadedCart] = useState(false);

    const rememberMe = useRef(false);
    const [cartOpen, setCartOpen] = useState(false);

    const [showLoginModal, setShowLoginModal] = useState(false);

    const cartLoadAction = useRef(LocalCartTransfer.SKIP);

    const getCartItems = () => user ? user.currentCart : localCart;

    useEffect(() => {
        const data = localStorage.getItem('localCartItems');
        if (data) setLocalCart(JSON.parse(data));
        setLoadedCart(true);
    }, []);

    useEffect(() => {
        if (loadedCart) localStorage.setItem('localCartItems', JSON.stringify(localCart));
    }, [localCart]);


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
    }, [user]);

    const setCartItems = (items: CartItem[]) => {
        if (user == null) setLocalCart(items);
        else setUser((user) => ({ ...user!, currentCart: items }));
    }

    const addProductOrder = (id: string) => {
        if (user == null) throw new Error("User not logged in!");
        setUser((user) => ({ ...user!, productOrders: [...user!.productOrders, id] }));
    }

    const addCakeOrder = (id: string) => {
        if (user == null) throw new Error("User not logged in!");
        setUser((user) => ({ ...user!, cakeOrders: [...user!.cakeOrders, id] }))
    }

    const addToCart = (item: CartItem) => {
        const cartItems = getCartItems();
        const isItemInCart = cartItems.find((cartItem) => (cartItem.itemId == item.itemId && cartItem.itemVariant == item.itemVariant));

        if (isItemInCart) {
            setCartItems(
                cartItems.map((cartItem) => (
                    cartItem.itemId == item.itemId && cartItem.itemVariant == item.itemVariant ?
                        { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
                ))
            );
        } else {
            setCartItems([...cartItems, item]);
        }
    };

    const removeFromCart = (itemId: string, itemVariant: string | null = null) => {
        const cartItems = getCartItems();

        const isItemInCart = cartItems.find((item) => (item.itemId == itemId && item.itemVariant == itemVariant));
        if (isItemInCart === undefined) return;

        if (isItemInCart.quantity == 1) {
            setCartItems(cartItems.filter((item) => item.itemId != itemId || item.itemVariant != itemVariant));
        } else {
            setCartItems(
                cartItems.map((item) => (
                    item.itemId == itemId && item.itemVariant == itemVariant ?
                        { ...item, quantity: item.quantity - 1 } : item
                ))
            );
        }
    };

    const removeItemsFromCart = (itemId: string, itemVariant: string | null = null) => {
        const cartItems = getCartItems();
        const isItemInCart = cartItems.find((item) => (item.itemId == itemId && item.itemVariant == itemVariant));
        if (isItemInCart === undefined) return;
        setCartItems(cartItems.filter((item) => item.itemId != itemId || item.itemVariant != itemVariant));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const checkQuantity = (itemId: string, itemVariant: string | null) => {
        const cartItems = getCartItems();
        const item = cartItems.find((item) => (item.itemId == itemId && item.itemVariant == itemVariant));
        if (item === undefined) return 0;
        return item.quantity;
    }

    const getCartItemCount = () => user ? user.currentCart.length : localCart.length;

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

    return (
        <UserContext.Provider value={{
            user,
            login,
            logout,
            hasLoggedIn: user != null,
            isCartOpen: cartOpen,
            setCartOpen: (open) => setCartOpen(open),
            cartLoaded: loadedCart,
            showLoginModal, 
            setCartLoadAction: (action: LocalCartTransfer) => { cartLoadAction.current = action; },
            setShowLoginModal,
            getCartItems,
            addToCart,
            removeFromCart,
            removeItemsFromCart,
            clearCart,
            getCartItemCount,
            checkQuantity,
            addProductOrder,
            addCakeOrder
        }}>
            {children}
        </UserContext.Provider>
    )
}