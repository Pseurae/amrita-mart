"use client"

import { useState } from 'react';
import { Product as ProductType, FoodCategories, ArticleCategories, imagePath } from '../../../types/product'
import { useProducts } from '../../_context/products';
import { Modal } from "@/components/Modal";
import { Product, Placeholder } from './_components/Product'
import ProductPreview from './_components/ProductPreview'
import { Listing } from './_components/Listing';

interface ProductListProps { 
    products: ProductType[], 
    searchPrompt: string, 
    setModalProduct: (product: ProductType) => void 
};

const ProductList = ({ products, searchPrompt, setModalProduct }: ProductListProps) => {
    const trimmedPrompt = searchPrompt.trim();
    const filteredProducts = products.filter((product) => {
        if (trimmedPrompt.length == 0) return true;

        if (product.name.toLowerCase().includes(trimmedPrompt.toLowerCase()))
            return true;

        if (product._hasVariants) {
            for (const variant of product.variants) {
                if (variant.name.toLowerCase().includes(trimmedPrompt.toLowerCase()))
                    return true;
            }
        }
        return false;
    });

    return (
        filteredProducts.length == 0 ? (
            <h1 className='font-semibold'>No products found for "{searchPrompt}".</h1>
        ) : (
            <Listing products={filteredProducts} callback={(product: ProductType) => (<Product product={product} key={product._id} onClick={() => setModalProduct(product)} />)} />
        )
    )
}

const PlaceholderList = () => {
    return (
        <Listing products={Array(12).fill(undefined)} callback={(_, i) => (<Placeholder key={i} />)} />
    )
};

export default function ShopPage_ () {
    const [modalProduct, setModalProduct] = useState<ProductType | null>(null);
    const [searchPrompt, setSearchPrompt] = useState<string>("");

    const { products, loading, error } = useProducts();

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

            <Modal isModalOpen={modalProduct != null} closeModal={() => setModalProduct(null)} parentStyles='grid place-content-center' overlayStyles="bg-black/[0.6] backdrop-blur-sm">
                <ProductPreview product={modalProduct!} />
            </Modal>
        </>
    );
}