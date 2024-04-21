"use client"

import { useState } from "react";
import { CartItem } from "../../_types/cartitem"
import { imagePath } from "../../_types/product"
import { useProducts } from "../../_context/products";
import { LocalCartTransfer, useUser } from "../../_context/user";
import Modal from "./Modal";

import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus, faSquareMinus, faTrash, faX, faSpinner } from '@fortawesome/free-solid-svg-icons'

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type CartItemInfo = {
    name: string;
    variantName: string | null;
    price: number;
    image: string;
};

const CartAnimationVariants = {
    hidden: { x: '100%' },
    visible: { x: '0%' },
    exit: { x: '100%' }
};

export default function Cart() {
    const { setCartLoadAction, setShowLoginModal, hasLoggedIn, getCartItems, isCartOpen, setCartOpen, addToCart, removeFromCart, removeItemsFromCart, clearCart, addProductOrder } = useUser();
    const { products, loading, error } = useProducts();

    const [checkingOut, setCheckingOut] = useState(false);

    const cartItems = getCartItems();

    const getProductDetails = (cartItem: CartItem): CartItemInfo | null => {
        const product = products.find((product) => product._id == cartItem.itemId);
        if (product == undefined) return null;

        if (product._hasVariants != (cartItem.itemVariant != null)) return null;

        if (product._hasVariants) {
            const variant = product.variants.find((variant) => variant._specId == cartItem.itemVariant);
            if (variant == undefined) return null;

            return {
                name: product.name,
                variantName: variant.name,
                price: variant.price,
                image: variant.image
            };
        }

        return {
            name: product.name,
            variantName: null,
            price: product.price,
            image: product.image
        };
    }

    const totalPrice = () => cartItems.reduce((total, cartItem) => {
        const product = getProductDetails(cartItem);
        if (product == null) return total;

        return total + product.price * cartItem.quantity;
    }, 0);

    const checkout = async () => {
        setCheckingOut(true);

        try {
            const response = await fetch("/api/order/products/create", {
                method: 'POST',
                body: JSON.stringify(cartItems)
            });

            await response.json().then(data => addProductOrder(data.id));

            if (!response.ok) {
                throw new Error('Failed to submit the data. Please try again.')
            }
        } catch (error) {
        } finally {
            setCheckingOut(false);
            clearCart();
        }
    }

    const tryCheckout = () => {
        if (hasLoggedIn) { checkout(); }
        else {
            setCartLoadAction(LocalCartTransfer.REPLACE);
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

                {cartItems.length == 0 ?
                    <h1 className="px-8 text-lg font-medium h-full grid place-content-center">No items are in the cart!</h1> :
                    (() => {
                        if (loading) return (<h1>Loading products...</h1>);
                        if (error) return (<h1>Error loading products...</h1>);

                        return (
                            <>
                                <ul className="grow px-8 hide-scrollbar h-full overflow-auto">
                                    <AnimatePresence mode="popLayout">
                                        {cartItems.map((cartItem: CartItem) => {
                                            const itemInfo = getProductDetails(cartItem);

                                            if (itemInfo == null) return null;

                                            return (
                                                <motion.li layout
                                                    // initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1, x: 0 }}
                                                    exit={{ scale: 1.0, opacity: 0, x: 100 }}
                                                    transition={{ type: "spring" }} key={`itemId: ${cartItem.itemId} itemVariant: ${cartItem.itemVariant}`} className="flex gap-5 border rounded-md mb-2 px-3 py-2"
                                                >
                                                    <div className="h-20 w-20 relative my-auto">
                                                        <Image fill className="h-full w-full object-contain" src={imagePath(itemInfo.image)} alt={itemInfo.image} />
                                                    </div>
                                                    <div className="my-auto grow flex flex-col space-between">
                                                        <div className="flex justify-between mb-4">
                                                            <h1 className="text-lg font-semibold">{itemInfo.name + ((itemInfo.variantName != null && " - " + itemInfo.variantName) || "")}</h1>
                                                            <button className="transition text-red-500 hover:text-red-400" onClick={() => { removeItemsFromCart(cartItem.itemId, cartItem.itemVariant) }}>
                                                                <FontAwesomeIcon className="fa-lg" icon={faTrash} />
                                                            </button>
                                                        </div>

                                                        <div className="flex justify-between">
                                                            <h1 className="font-medium text-lg">₹{itemInfo.price}</h1>
                                                            <div className="my-auto gap-3 flex">
                                                                <button className="transition text-slate-400 hover:text-slate-300" onClick={() => addToCart({ ...cartItem, quantity: 1 })}>
                                                                    <FontAwesomeIcon className="fa-xl" icon={faSquarePlus} />
                                                                </button>
                                                                <p className="text-lg">x<span className="font-semibold">{cartItem.quantity}</span></p>
                                                                <button className="transition text-slate-400 hover:text-slate-300" onClick={() => removeFromCart(cartItem.itemId, cartItem.itemVariant)}>
                                                                    <FontAwesomeIcon className='fa-xl' icon={faSquareMinus} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.li>
                                            )
                                        })}
                                    </AnimatePresence>
                                </ul>

                                <div className="flex flex-col gap-5">
                                    <button className="mx-8 border-2 border-blue-500 py-3 font-semibold rounded-full text-blue-500 transition hover:bg-blue-500 hover:text-white" onClick={clearCart}>Clear Cart</button>

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
                                </div>
                            </>
                        )
                    })()
                }
            </motion.div>
        </Modal>
    );
}