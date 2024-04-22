"use client"

import { ReactNode } from "react";
import { Product as ProductType } from "@/types/product";

export const Listing = ({ products, callback }: Readonly<{
    products: ProductType[]
    callback: (value: ProductType, index: number, array: ProductType[]) => ReactNode;
}>) => (
    <div className="grid grid-cols-4 gap-5">
        {products.map(callback)}
    </div>
)