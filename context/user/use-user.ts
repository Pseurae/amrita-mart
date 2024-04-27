"use client"

import { CartItem } from "@/types/cartitem";
import { useState } from "react";
import { Cart } from "./cart";
import { Session } from "./session";
import useLocalCart from "./use-localcart";
import useUserDetails from "./use-userdetails";
import useUserSession from "./use-usersession";
import useUserToken from "./use-usertoken";

export const useUser = () => {
    const [userToken, setUserToken, loadedToken] = useUserToken();
    const loggedIn = userToken != "";

    const [localCart, setLocalCart, loadedLocalCart] = useLocalCart();
    const [cartOpen, setCartOpen] = useState(false);

    const [session, setSession, loadedSession] = useUserSession(userToken, loggedIn);
    const [userDetails, loadedDetails] = useUserDetails(userToken, loggedIn);

    const [showLoginModal, setShowLoginModal] = useState(false);

    // 
    const cartItems = loggedIn ? session.currentCart : localCart;
    const setCartItems = (value: CartItem[]) => {
        loggedIn ? setSession({ ...session, currentCart: value }) : setLocalCart(value);
    }

    // 
    const cart: Cart = new Cart(cartItems, setCartItems);
    const sessionControl: Session = new Session(session, setSession);

    //
    const login = (token: string) => {
        if (loggedIn) {
            fetch('/api/auth/logout', {
                method: 'POST',
                headers: { token: userToken }
            });
        }

        setUserToken(token);
    }

    const logout = () => {
        if (!loggedIn) return;

        fetch('/api/auth/logout', {
            method: 'POST',
            headers: { token: userToken }
        });

        setUserToken('');
    };

    return {
        userToken,
        loadedToken,
        loggedIn,
        login,
        logout,

        isCartOpen: cartOpen,
        setCartOpen,
        loadedCart: loggedIn ? loadedSession : loadedLocalCart,

        cart,
        session: sessionControl,

        showLoginModal,
        setShowLoginModal,

        userDetails,
        loadedDetails,
    };
}

export type UserContextType = ReturnType<typeof useUser>;