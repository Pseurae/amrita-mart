import { Metadata } from "next";
import { Product as ProductType } from '../../_types/product'
import Page from "./_page"

export const metadata: Metadata = {
    title: "AmritaMart - Shop",
};

export default async function () {
    return (
        <Page />
    );
}