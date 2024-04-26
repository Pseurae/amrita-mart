"use client"

import { UserDetails } from "@/types/user-auth";
import { useEffect, useState } from "react";

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

export default useUserDetails;