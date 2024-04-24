"use client"

import { useUserContext } from '@/context/user';
import { ArticleCategories, FoodCategories, Product as ProductType } from '@/types/product'
import { useState } from 'react'
import { motion } from "framer-motion";
import Image from 'next/image';
import { PopupAnimationVariants } from '@/libs/common';
import { ProductImage } from '@/libs/products';
import VariantButton from './VariantButton';

const getCategoryName = (category: FoodCategories | ArticleCategories) => {
    switch (category) {
        case 'veg':
        case 'non-veg':
            return "Food";
        case 'beverage':
            return "Beverage"
        case 'snack':
            return "Snacks"
        case 'stationary':
            return "Stationary"
        case 'hygiene':
            return "Hygiene";
    }
};

const ProductPreview = ({ product }: { product: ProductType }) => {
    const { cart } = useUserContext();
    const [selVariant, setSelVariant] = useState<number | null>(product._hasVariants ? product.defaultVariant : null);

    const addItemToCart = () => {
        cart.addItem(product._id, variantId, 1);
    }

    const category = product._hasVariants ? product.variants[selVariant!].category : product.category;
    const previewImage = product._hasVariants ? product.variants[selVariant!].image : product.image;
    const variantId = product._hasVariants ? product.variants[selVariant!]._specId : null;

    return (
        <motion.div className="bg-gradient-to-b rounded-3xl shadow-lg from-pink-400 to-rose-400"
            variants={PopupAnimationVariants} initial="hidden" animate="visible" exit="exit" transition={{ ease: 'easeInOut' }}
        >
            <div className='m-2 flex flex-col bg-slate-100 p-12 rounded-2xl gap-2'>
                <div className="w-96 h-96 rounded-xl bg-white overflow-hidden shadow-xl mb-2 relative">
                    <Image fill className='h-full w-full object-contain' src={ProductImage(previewImage)} alt="" />
                </div>

                <div>
                    <h2 className='font-semibold text-red-400'>{getCategoryName(category)}</h2>
                    <h1 className='font-serif font-bold text-2xl'>{product.name}</h1>
                </div>

                {product._hasVariants ? (
                    <>
                        <div className="flex gap-3 overflow-auto w-96 mx-auto hide-scrollbar flex-wrap">
                            {product.variants.map((variant, i) => (
                                <VariantButton name="variants" id={variant._specId} key={variant._specId} variant={variant} checked={selVariant == i} onChange={() => setSelVariant(i)} />))
                            }
                        </div>
                        <h2 className='font-semibold font-mono text-xl'>₹{product.variants[selVariant!].price}</h2>
                    </>
                ) : (
                    <h2 className='font-semibold font-mono text-xl'>₹{product.price}</h2>
                )}

                <button className='mt-1 px-3 py-2 border-2 border-rose-400 rounded-full font-semibold text-rose-400 hover:bg-rose-400 hover:text-white transition' onClick={addItemToCart}>
                    Add to Cart! ({cart.checkQuantity(product._id, variantId)})
                </button>
            </div>
        </motion.div>
    )
};

export default ProductPreview;