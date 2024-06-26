import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus, faSquareMinus, faTrash, faX, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { CartItemInfo } from "@/types/cartiteminfo";
import { useUserContext } from "@/context/user";

import PlaceholderBar from "@/components/PlaceholderBar"
import { ProductImage } from "@/libs/products";
import { MutableRefObject, forwardRef } from "react";

interface CartItemProps {
    itemInfo: NonNullable<CartItemInfo>;
};

export function PlaceholderCartItem() {
    return (
        <li className="flex gap-5 border rounded-md mb-2 px-3 py-2">
            <div className="h-20 w-20 relative my-auto animate-pulse bg-gray-200">
            </div>

            <div className="my-auto grow flex flex-col space-between">
                <div className="flex justify-between mb-4 gap-3">
                    <PlaceholderBar className="text-lg font-semibold grow" />

                    <button disabled={true} className="text-gray-400">
                        <FontAwesomeIcon className="fa-lg" icon={faTrash} />
                    </button>
                </div>

                <PlaceholderBar className="font-medium text-lg" />
            </div>
        </li>
    );
}

export const CartItem = forwardRef(function CartItem({ itemInfo }: CartItemProps, ref) {
    const { cart } = useUserContext();

    return (
        <motion.li layout
            ref={ref as MutableRefObject<HTMLLIElement>}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 1.0, opacity: 0, x: 100 }}
            transition={{ type: "spring" }} 
            className="flex gap-5 border rounded-md mb-2 px-3 py-2"
        >
            <div className="h-20 w-20 relative my-auto">
                <Image fill className="h-full w-full object-contain" src={ProductImage(itemInfo.image)} alt={itemInfo.image} />
            </div>
            <div className="my-auto grow flex flex-col space-between">
                <div className="flex justify-between mb-4 gap-3">
                    <h1 className="text-lg font-semibold truncate">{itemInfo.name + ((itemInfo.variantName != null && " - " + itemInfo.variantName) || "")}</h1>

                    <button className="transition text-red-500 hover:text-red-400" onClick={() => cart.removeItem(itemInfo.id, itemInfo.variant, true)}>
                        <FontAwesomeIcon className="fa-lg" icon={faTrash} />
                    </button>
                </div>

                <div className="flex justify-between">
                    <h1 className="font-medium text-lg">₹{itemInfo.price}</h1>

                    <div className="my-auto gap-3 flex">
                        <button className="transition text-slate-400 hover:text-slate-300" onClick={() => cart.addItem(itemInfo.id, itemInfo.variant, 1)}>
                            <FontAwesomeIcon className="fa-xl" icon={faSquarePlus} />
                        </button>

                        <p className="text-lg">x<span className="font-semibold">{itemInfo.quantity}</span></p>

                        <button className="transition text-slate-400 hover:text-slate-300" onClick={() => cart.removeItem(itemInfo.id, itemInfo.variant, false)}>
                            <FontAwesomeIcon className='fa-xl' icon={faSquareMinus} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.li>
    );
}) 