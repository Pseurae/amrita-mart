import { Metadata } from "next";
import Page from './_page'

export const metadata: Metadata = {
    title: "AmritaMart - Profile",
};

export default async function () {
    return (
        <Page />
    );
}