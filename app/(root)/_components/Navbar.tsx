"use client"

import Link from "next/link"
import { LocalCartTransfer, useUser } from "../../_context/user";

export default function () {
    const { setShowLoginModal, user, hasLoggedIn, setCartLoadAction, logout, cartLoaded, getCartItemCount, setCartOpen } = useUser();

    const openLoginModal = () => {
        setCartLoadAction(LocalCartTransfer.SKIP); 
        setShowLoginModal(true);
    }

    return (
        <nav className="sticky top-0 left-0 px-20 py-3 bg-white shadow z-40">
            <ul className="flex gap-5">
                <li><p className="font-semibold py-2 rounded cursor-default block"><span className="text-red-700">Amrita</span>Mart</p></li>

                <li><Link href="/shop" className="py-2 px-3 rounded-lg hover:bg-gray-100 block">Shop</Link></li>
                <li><Link href="/cake-booking" className="py-2 px-2 rounded-lg hover:bg-gray-100 block">Book a Cake!</Link></li>

                <li className="ml-auto">
                    <a className="bg-red-400 py-2 px-3 rounded-lg cursor-pointer hover:bg-red-600 flex gap-2 text-white" onClick={() => setCartOpen(true)}>
                        Cart {cartLoaded && <span className=" rounded-full font-medium bg-white text-red-800 inline-block w-6 aspect-square text-center">{getCartItemCount()}</span>}
                    </a>
                </li>

                <li>
                    {hasLoggedIn ?
                        (<Link href="/profile" className="py-2 px-4 rounded-lg hover:bg-gray-100 block font-semibold">{user?.userName}</Link>) :
                        (<a className="bg-red-400 py-2 px-3 rounded-lg cursor-pointer hover:bg-red-600 flex gap-2 text-white" onClick={openLoginModal}>
                            Login
                        </a>)
                    }
                </li>

                {hasLoggedIn && (
                    <li>
                        <a className="bg-red-400 py-2 px-3 rounded-lg cursor-pointer hover:bg-red-600 flex gap-2 text-white" onClick={logout}>
                            Logout
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    )
}