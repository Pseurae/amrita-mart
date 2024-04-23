import { Metadata } from "next";
import Page from "./_page"

export const metadata: Metadata = {
    title: "AmritaMart - Shop",
};

export default async function ShopPage() {
    return (
        <Page />
    );
}