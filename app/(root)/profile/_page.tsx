"use client"
import './hook.css'
import { useUserContext } from "@/context/user";

import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons'

import ProductOrders from './_components/ProductOrders';
import CakeOrders from './_components/CakeOrders';

const Sidebar = () => {
    const { userDetails, session } = useUserContext();
    const productOrders = session.getProductOrders(),
        cakeOrders = session.getCakeOrders();

    return (
        <div className="px-10 py-10 w-96 h-full flex flex-col bg-slate-50">
            <div className='mb-8 w-full aspect-square grid place-content-center bg-zinc-400 text-zinc-100 rounded-full'>
                <FontAwesomeIcon className='fa-8x mx-auto' icon={faUser} />
            </div>

            <h1 className="text-2xl font-bold font-serif text-center">{userDetails?.fullname}</h1>
            <h1 className="text-md opacity-80 text-center mb-1.5">@{userDetails?.username}</h1>
            <h1 className="text-md text-center"><FontAwesomeIcon icon={faEnvelope} /> {userDetails?.email}</h1>

            <div className='mt-auto mb-4'>
                <h1 className='text-center font-bold font-serif text-2xl'>{productOrders.length}</h1>
                <h2 className='text-center opacity-80 text-lg font-semibold'>Products</h2>
            </div>

            <div>
                <h1 className='text-center font-bold font-serif text-2xl'>{cakeOrders.length}</h1>
                <h2 className='text-center opacity-80 text-lg font-semibold'>Cakes</h2>
            </div>
        </div>
    )
}

export default function ProfilePage_() {
    const { session, loggedIn, loadedToken } = useUserContext();
    const productOrders = session.getProductOrders(),
        cakeOrders = session.getCakeOrders();

    return (loggedIn ? (
        <div className="flex grow overflow-hidden">
            <Sidebar />
            <main className="px-10 py-10 w-full overflow-auto flex flex-col gap-10">
                {productOrders.length != 0 && (
                    <div>
                        <h1 className="font-serif text-3xl font-semibold mb-5">Product Orders: </h1>
                        <ProductOrders orders={productOrders} />
                    </div>
                )}

                {cakeOrders.length != 0 && (
                    <div>
                        <h1 className="font-serif text-3xl font-semibold mb-5">Cake Orders: </h1>
                        <CakeOrders orders={cakeOrders} />
                    </div>
                )}

                {(productOrders.length == 0 && cakeOrders.length == 0) && (
                    <h1 className='font-serif text-2xl text-2xl'>No products have been placed!</h1>
                )}
            </main>
        </div>
    ) : (loadedToken ?
        (
            <div className="grid place-content-center py-10">
                <h1 className="font-semibold text-xl">Please login to see your profile.</h1>
            </div>
        ) : (
            <div className="grid place-content-center py-10">
                <h1 className="font-semibold text-xl"><FontAwesomeIcon icon={faSpinner} className='animate-spin mr-2' />Please wait...</h1>
            </div>
        )
    ));
}