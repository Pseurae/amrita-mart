"use client"

import { useUser } from "../../_context/user";

export default function() {
    const { user, hasLoggedIn } = useUser();
    return (hasLoggedIn ? (
        <div className="px-20 py-5 flex gap-10">
            <div>
                <h1 className="text-xl font-bold">{user?.fullName}</h1>
                <h1 className="text-lg opacity-80">{user?.userName}</h1>
                <h1>{user?.email}</h1>
            </div>

            <div>
                <h1 className="font-semibold">Product Orders: </h1>
                {user?.productOrders.map((order) => (
                    <p>{order}</p>
                ))}
            </div>

            <div>
                <h1 className="font-semibold">Cake Orders: </h1>
                {user?.cakeOrders.map((order) => (
                    <p>{order}</p>
                ))}
            </div>
        </div>
    ) : (
        <div className="grid place-content-center py-10">
            <h1 className="font-semibold text-xl">Please login to see your profile.</h1>
        </div>
    ));
}