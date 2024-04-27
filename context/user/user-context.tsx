"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { UserContextType, useUser } from "./use-user";

const UserContext = createContext<UserContextType>(null!);
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    const context = useUser();

    return (
        <UserContext.Provider value={context}>
            {children}
        </UserContext.Provider>
    )
}