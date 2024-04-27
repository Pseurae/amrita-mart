"use client"

import { useState } from 'react';
import { Product as ProductType } from '@/types/product'
import { Modal } from "@/components/Modal";
import { ProductPreview } from './_components/ProductPreview'
import { ProductList, PlaceholderList } from './_components/ProductList';
import useSWR from 'swr';

export default function ShopPage_() {
    const [modalProduct, setModalProduct] = useState<ProductType | undefined>(undefined);
    const [searchPrompt, setSearchPrompt] = useState<string>("");

    const {data: products, isLoading: loading, error} = useSWR('/api/products/', (v: string) => fetch(v).then(res => res.json()))

    return (
        <>
            <div className="px-20 py-5 bg-gray-50 grid grid-cols-9 gap-12 grow">
                <div id="products" className="col-start-2 col-end-9">
                    <input className="border rounded-full focus:border-blue-400 px-6 py-3 outline-none flex-grow block w-full" type="search" placeholder="Search for products..." autoComplete='off' value={searchPrompt} id="productSearchbar" onChange={(e) => setSearchPrompt(e.target.value)} />

                    <br />

                    {(() => {
                        if (loading) return (<PlaceholderList />);
                        if (error) return (<p>Error</p>);

                        return (<ProductList products={products} searchPrompt={searchPrompt} setModalProduct={setModalProduct} />);
                    })()}
                </div>
            </div>

            <Modal isModalOpen={modalProduct != undefined} closeModal={() => setModalProduct(undefined)} parentStyles='grid place-content-center' overlayStyles="bg-black/[0.6] backdrop-blur-sm">
                <ProductPreview product={modalProduct!} />
            </Modal>
        </>
    );
}