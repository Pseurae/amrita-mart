import { Metadata } from "next";
import Admin from "./admin"

export const metadata: Metadata = {
    title: "AmritaMart - Admin",
};

export default function() {
    return (
        <Admin />
    )
}