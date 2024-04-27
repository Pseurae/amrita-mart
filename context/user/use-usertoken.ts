import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";

const useUserToken = (): [string, Dispatch<SetStateAction<string>>, boolean] => {
    const [token, setToken] = useState<string>("");
    const [loaded, setLoaded] = useState(false);

    useLayoutEffect(() => {
        const data = localStorage.getItem('userToken');
        if (data) setToken(data);
        setLoaded(true);
    }, []);

    useLayoutEffect(() => {
        if (loaded) localStorage.setItem('userToken', token);
    }, [token]);

    return [token, setToken, loaded];
}

export default useUserToken;
