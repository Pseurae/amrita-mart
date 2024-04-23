"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { Product as ProductType } from '@/types/product'
import useSWR from "swr";

type ProductContextType = {
    products: ProductType[]
    loading: boolean;
    error: boolean;
};

const ProductContext = createContext<ProductContextType>(null!);

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { data, isLoading, error } = useSWR('/api/products/', (v: string) => fetch(v).then(res => res.json()))

    return (
        <ProductContext.Provider value={{ products: data, loading: isLoading, error }}>
            {children}
        </ProductContext.Provider>
    )
}