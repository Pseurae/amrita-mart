"use client"

import { CartItem } from "@/types/cartitem";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Cart } from "./cart";
import useSWR from "swr";
import { UserDetails } from "@/types/user-auth";
import { Session } from "@/types/session";

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

const useUserDetails = (token: string): [UserDetails | undefined, boolean] => {
    const [details, setDetails] = useState<UserDetails | undefined>(undefined!);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch('/api/auth/details', { headers: { token } }).then(res => res.json()).then(data => {
            setDetails(data);
            setLoaded(true);
        }).catch((error) => {
            setLoaded(true);
        });
    }, [token]);

    return [details, loaded];
};

const useUserToken = (): [string, Dispatch<SetStateAction<string>>, boolean] => {
    const [token, setToken] = useState<string>("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem('userToken');
        if (data) setToken(data);
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) localStorage.setItem('userToken', token);
    }, [token]);

    return [token, setToken, loaded];
}

const useUserSession = (token: string): [Session, Dispatch<SetStateAction<Session>>, boolean] => {
    const [session, setSession] = useState<Session>({
        cakeOrders: [],
        currentCart: [],
        productOrders: []
    });

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch('/api/session/load', { headers: { token } }).then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        }).then(data => {
            setSession(data);
            setLoaded((f) => true);
        }).catch((error) => {
            setLoaded((f) => true);
        });
    }, [token]);

    useEffect(() => {
        if (!loaded) return;

        fetch('/api/session/save/', {
            method: 'POST',
            headers: { token },
            body: JSON.stringify(session),
        })
    }, [session]);

    return [session, setSession, loaded]
}

export const useUser = () => {
    const [userToken, setUserToken, tokenLoaded] = useUserToken();
    const [localCart, setLocalCart, loadedLocalCart] = useLocalCart();
    const [cartOpen, setCartOpen] = useState(false);
    const [session, setSession, loadedSession] = useUserSession(userToken);

    const loggedIn = userToken != "";

    const [showLoginModal, setShowLoginModal] = useState(false);

    // 
    const getCartItems = () => loggedIn ? session.currentCart : localCart;
    const setCartItems = (value: CartItem[]) => {
        if (!loggedIn) setLocalCart(value);
        else setSession({ ...session, currentCart: value });
    }

    //
    const [userDetails, loadedUserDetails] = useUserDetails(userToken);

    // 
    const cart: Cart = new Cart(getCartItems(), setCartItems);

    const addProductOrder = (id: string) => {
        setSession((session) => ({ ...session!, productOrders: [...session!.productOrders, id] }));
    }

    const addCakeOrder = (id: string) => {
        setSession((session) => ({ ...session!, cakeOrders: [...session!.cakeOrders, id] }));
    }

    return {
        userToken,
        setUserToken,
        isCartOpen: cartOpen,
        setCartOpen,
        loadedCart: loggedIn ? loadedSession : loadedLocalCart,
        cart,
        showLoginModal,
        setShowLoginModal,
        userDetails,
        loadedUserDetails,
        loggedIn,
        tokenLoaded,
        addProductOrder,
        addCakeOrder,
        session
    };
}

export type UserContextType = ReturnType<typeof useUser>;