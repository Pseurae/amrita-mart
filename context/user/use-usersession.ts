import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Session as SessionType } from "@/types/session";

const useUserSession = (token: string, loggedIn: boolean): [SessionType, Dispatch<SetStateAction<SessionType>>, boolean] => {
    const [session, setSession] = useState<SessionType>({
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
        if (!(loggedIn && loaded)) return;

        fetch('/api/session/save/', {
            method: 'POST',
            headers: { token },
            body: JSON.stringify(session),
        })
    }, [session]);

    return [session, setSession, loaded]
}

export default useUserSession;