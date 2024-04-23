"use client"

import { ReactNode } from "react";
import { Product as ProductType } from "@/types/product";

interface ListingProps {
    products: ProductType[]
    callback: (value: ProductType, index: number, array: ProductType[]) => ReactNode;
};

const Listing = ({ products, callback }: ListingProps) => (
    <div className="grid grid-cols-4 gap-5">
        {products.map(callback)}
    </div>
)

export default Listing;