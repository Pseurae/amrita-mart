"use client"

import { CartItem } from "@/types/cartitem";
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from "react";
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

const useUserDetails = (token: string, loggedIn: boolean): [UserDetails | undefined, boolean] => {
    const [details, setDetails] = useState<UserDetails | undefined>(undefined!);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loggedIn) return;

        fetch('/api/auth/details', { headers: { token } }).then(res => {
            if (!res.ok) return Promise.reject("Couldn't not retrieve user details.");
            return res.json()
        }).then(data => {
            setDetails(data);
            setLoaded(true);
        });
    }, [token]);

    return [details, loaded];
};

const useUserToken = (): [string, Dispatch<SetStateAction<string>>, boolean] => {
    const [token, setToken] = useState<string>("");
    const [loaded, setLoaded] = useState(false);

    useLayoutEffect(() => {
        const data = localStorage.getItem('userToken');
        if (data) setToken(data);
        setLoaded(true);
    }, []);

    useLayoutEffect(() => {
        if (loaded) localStorage.setItem('userToken', token);
    }, [token]);

    return [token, setToken, loaded];
}

const useUserSession = (token: string, loggedIn: boolean): [Session, Dispatch<SetStateAction<Session>>, boolean] => {
    const [session, setSession] = useState<Session>({
        cakeOrders: [],
        currentCart: [],
        productOrders: []
    });

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loggedIn) return;

        fetch('/api/session/load', { headers: { token } }).then(res => {
            if (!res.ok) return Promise.reject("Could not retrieve session data.");
            return res.json();
        }).then(data => {
            setSession(data);
            setLoaded(true);
        });
    }, [token]);

    useEffect(() => {
        if (!loggedIn) return;
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
    const [userToken, setUserToken, loadedToken] = useUserToken();
    const [localCart, setLocalCart, loadedLocalCart] = useLocalCart();
    const [cartOpen, setCartOpen] = useState(false);

    const loggedIn = userToken != "";

    const [session, setSession, loadedSession] = useUserSession(userToken, loggedIn);


    const [showLoginModal, setShowLoginModal] = useState(false);

    // 
    const getCartItems = () => loggedIn ? session.currentCart : localCart;
    const setCartItems = (value: CartItem[]) => {
        loggedIn ? setSession({ ...session, currentCart: value }) : setLocalCart(value);
    }

    //
    const [userDetails, loadedDetails] = useUserDetails(userToken, loggedIn);

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
        loggedIn,
        isCartOpen: cartOpen,
        setCartOpen,
        loadedCart: loggedIn ? loadedSession : loadedLocalCart,
        cart,
        showLoginModal,
        setShowLoginModal,
        userDetails,
        loadedDetails,
        loadedToken,
        addProductOrder,
        addCakeOrder,
        session
    };
}

export type UserContextType = ReturnType<typeof useUser>;