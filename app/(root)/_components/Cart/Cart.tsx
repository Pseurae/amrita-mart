"use client"

import { useState } from "react";
import { CartItem as CartItemType } from "@/types/cartitem"
import { useUserContext } from "@/context/user";
import { Modal } from "@/components/Modal";

import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faSpinner } from '@fortawesome/free-solid-svg-icons'

import { motion, AnimatePresence } from "framer-motion";
import { CartItem, PlaceholderCartItem } from "./CartItem";
import useCartItemInfo from "./use-cartiteminfo";

const CartAnimationVariants = {
    hidden: { x: '100%' },
    visible: { x: '0%' },
    exit: { x: '100%' }
};

export default function Cart() {
    const { isCartOpen, setCartOpen, cart, session, setShowLoginModal, loadedToken } = useUserContext();
    const [products, loaded] = useCartItemInfo(cart.items);

    const [checkingOut, setCheckingOut] = useState(false);

    const getCartItemInfo = (id: string, variant: string | null) => {
        return products.find((i) => i != undefined && i.id == id && i.variant == variant);
    }

    const totalPrice = () => cart.items.reduce((total, item) => {
        const product = getCartItemInfo(item.id, item.variant);
        if (product == undefined) return total;
        return total + product.price * item.quantity;
    }, 0);

    const checkout = async () => {
        setCheckingOut(true);

        try {
            const response = await fetch("/api/order/products/create", {
                method: 'POST',
                body: JSON.stringify(cart.items)
            });

            if (!response.ok) throw new Error('Failed to submit the data. Please try again.');
            response.json().then(data => session.addProductOrder(data.id));
        } catch (error) {
        } finally {
            setCheckingOut(false);
            cart.clear();
        }
    }

    const tryCheckout = () => {
        if (loadedToken) { checkout(); }
        else {
            setShowLoginModal(true);
            setCartOpen(false);
        }
    }

    return (
        <Modal isModalOpen={isCartOpen} closeModal={() => setCartOpen(false)} overlayStyles="bg-black/[0.6] backdrop-blur-sm">
            <motion.div className="absolute h-screen w-1/4 right-0 bg-white border-l shadow-sm py-5 flex flex-col gap-5"
                variants={CartAnimationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                    ease: "circOut"
                }}
            >
                <div className="flex justify-between px-8">
                    <h1 className="py-1.5 text-xl font-semibold">Shopping Cart</h1>
                    <button className="py-1.5 transition hover:text-gray-500" onClick={() => { setCartOpen(false) }}>
                        <FontAwesomeIcon className="fa-2xl" icon={faX} />
                    </button>
                </div>


                <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
                    {cart.items.length == 0 ?
                        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-8 text-lg font-medium h-full grid place-content-center">No items are in the cart!</motion.h1> :
                        (() => {
                            if (!loaded) return (
                                <ul className="grow px-8 hide-scrollbar h-full overflow-auto">
                                    {Array(cart.items.length).fill(true).map((_, i) => <PlaceholderCartItem key={i} />)}
                                </ul>
                            );
                            // if (error) return (<h1>Error loading products...</h1>);

                            return (
                                [
                                    <motion.ul animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ ease: "easeInOut", duration: 0.5 }} key="itemList" className="grow px-8 hide-scrollbar h-full overflow-auto">
                                        <AnimatePresence initial={false} mode="popLayout">
                                            {cart.items.map((item: CartItemType) => {
                                                const itemInfo = getCartItemInfo(item.id, item.variant);
                                                if (itemInfo == undefined) return null;

                                                return (
                                                    <CartItem key={`itemId: ${itemInfo.id} itemVariant: ${itemInfo.variant}`} itemInfo={itemInfo} />
                                                )
                                            })}
                                        </AnimatePresence>
                                    </motion.ul>,

                                    <motion.div animate={{ y: '0%' }} exit={{ y: '130%' }} transition={{ ease: "easeInOut", duration: 0.5 }} key='checkoutOptions' className="flex flex-col gap-5 mt-auto">
                                        <button className="mx-8 border-2 border-blue-500 py-3 font-semibold rounded-full text-blue-500 transition hover:bg-blue-500 hover:text-white" onClick={() => cart.clear()}>Clear Cart</button>

                                        <div className="h-px w-full bg-gray-300" />

                                        <div className="mx-8 flex justify-between">
                                            <h1 className="text-md">Subtotal</h1>
                                            <h1 className="text-md font-semibold">₹{totalPrice()}</h1>
                                        </div>

                                        <button className="mx-8 transition border-2 border-red-500 py-3 font-semibold rounded-full enabled:text-red-500 enabled:hover:bg-red-500 enabled:hover:text-white disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed" onClick={tryCheckout} disabled={checkingOut}>{checkingOut ? (
                                            <>
                                                <FontAwesomeIcon className="animate-spin" icon={faSpinner} />   Checking out...
                                            </>
                                        ) : "Checkout"}</button>
                                    </motion.div>
                                ]
                            )
                        })()
                    }
                </AnimatePresence>
            </motion.div>
        </Modal>
    );
}