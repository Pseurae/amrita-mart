"use client"

import Link from "next/link"
import { LocalCartTransfer, useUser } from "../../../_context/user";

import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faUser, faAngleDown, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useRef, useState } from "react";
import PlaceholderBar from "@/components/PlaceholderBar";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
    const { setShowLoginModal, user, hasLoggedIn, setCartLoadAction, logout, cartLoaded, getCartItemCount, setCartOpen, loadedUser } = useUser();
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const openLoginModal = () => {
        setCartLoadAction(LocalCartTransfer.SKIP);
        setShowLoginModal(true);
    }

    return (
        <nav className="sticky top-0 left-0 px-20 py-3 bg-white shadow z-40">
            <ul className="flex gap-5 items-center">
                <li><Link href="/" className="font-logo text-xl py-2.5 rounded block"><span className="text-red-700">Amrita</span>Mart</Link></li>

                <li className="ml-auto"><Link href="/shop" className="py-2.5 px-3 text-lg rounded-lg hover:bg-gray-100 block">Shop</Link></li>
                <li><Link href="/cake-booking" className="py-2.5 px-3 text-lg rounded-lg hover:bg-gray-100 block">Book a Cake!</Link></li>

                <li>
                    <a className="py-2.5 px-3 text-lg rounded-lg cursor-pointer hover:bg-gray-100 block" onClick={() => setCartOpen(true)}>
                        <FontAwesomeIcon className="mr-1" icon={faCartShopping} /> Cart {cartLoaded && <span>({getCartItemCount()})</span>}
                    </a>
                </li>

                <li className="relative">
                    {loadedUser ? (
                        hasLoggedIn ? (
                            <>
                                <a className="py-2.5 px-3 rounded-lg cursor-pointer block text-lg hover:bg-gray-100" onClick={() => setShowUserDropdown(val => !val)}>
                                    <FontAwesomeIcon className="mr-1" icon={faUser} /> {user!.fullName} <FontAwesomeIcon className="ml-1" icon={faAngleDown} />
                                </a>

                                {showUserDropdown && (
                                    <ProfileDropdown key="profileDropdown" close={() => setShowUserDropdown(false)}>
                                        <p className="px-5 py-2 w-full text-nowrap">Logged in: <span className="font-medium">{user!.userName}</span></p>
                                        <Link href="/profile" className="block w-full px-5 py-2 hover:bg-gray-200" onClick={() => setShowUserDropdown(false)}><FontAwesomeIcon className="mr-1" icon={faUser} /> Profile</Link>
                                        <a className="block w-full px-5 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => { setShowUserDropdown(false); logout(); }}><FontAwesomeIcon className="mr-1" icon={faRightFromBracket} /> Logout</a>
                                    </ProfileDropdown>
                                )}
                            </>
                        ) : (
                            <a className="py-2.5 px-3 rounded-lg bg-sky-400 text-white transition shadow-md shadow-sky-400/40 hover:shadow-sky-300/40 hover:bg-sky-300 block text-lg cursor-pointer" onClick={openLoginModal}>
                                Login
                            </a>
                        )
                    ) : (
                        <PlaceholderBar className="w-24" />
                    )}
                </li>
            </ul>
        </nav>
    )
}