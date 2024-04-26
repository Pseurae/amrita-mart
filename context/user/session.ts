import { Session as SessionType } from "@/types/session";
import { Dispatch, SetStateAction } from "react";

export class Session {
    readonly session: SessionType | undefined;
    setSession: Dispatch<SetStateAction<SessionType>>;

    constructor(session: SessionType | undefined, setSession: Dispatch<SetStateAction<SessionType>>) {
        this.session = session;
        this.setSession = setSession;
    }

    addProductOrder(id: string) {
        if (this.session == undefined) throw new Error("No session has been loaded");
        this.setSession((session) => ({ ...session, productOrders: [...session.productOrders, id] }));
    }

    addCakeOrder(id: string) {
        if (this.session == undefined) throw new Error("No session has been loaded");
        this.setSession((session) => ({ ...session, cakeOrders: [...session.cakeOrders, id] }));
    }

    getProductOrders() {
        if (this.session == undefined) throw new Error("No session has been loaded");
        return this.session.productOrders;
    }

    getCakeOrders() {
        if (this.session == undefined) throw new Error("No session has been loaded");
        return this.session.cakeOrders;
    }
};