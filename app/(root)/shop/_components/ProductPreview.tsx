"use client"

import { useUser } from '../../../_context/user';
import { Product as ProductType, imagePath } from '../../../_types/product'
import { InputHTMLAttributes, useState } from 'react'
import { getCategoryName } from '../_lib/common';

const VariantButton = ({ variant, ...props }: { variant: any } & InputHTMLAttributes<HTMLInputElement>) => (
    <label 
        className={'cursor-pointer flex gap-2 px-4 py-2 rounded-full border text-gray-500 border-gray-500 transition has-[:checked]:text-red-400 has-[:checked]:bg-red-50 has-[:checked]:border-red-400'}>
        <input className='hidden' type="radio" {...props} />
        <img className='h-6 w-6 object-cover rounded-full' src={imagePath(variant.image)} alt={variant.image} />
        <h1>{variant.name}</h1>
    </label>
);

const ProductPreview = ({ product }: { product: ProductType }) => {
    const { addToCart } = useUser();
    const [selVariant, setSelVariant] = useState<number | null>(product._hasVariants ? product.defaultVariant : null);

    const getCategory = () => {
        if (!product._hasVariants) {
            return product.category;
        }

        return product.variants[selVariant!].category;
    }

    const previewImage = product._hasVariants ? product.variants[selVariant!].image : product.image;
    const variantId = (product._hasVariants ? product.variants[selVariant!]._specId : null);

    return (
        <div className="bg-gradient-to-b rounded-3xl shadow-lg from-pink-400 to-rose-400 background-animate">
            <div className='m-2 flex flex-col bg-slate-100 p-12 rounded-2xl gap-2'>
                <div className="w-96 h-96 rounded-xl bg-white overflow-hidden shadow-xl mb-2">
                    <img className='h-full w-full object-contain' src={imagePath(previewImage)} alt="" />
                </div>

                <div>
                    <h2 className='font-semibold text-red-400'>{getCategoryName(getCategory())}</h2>
                    <h1 className='font-bold text-xl'>{product.name}</h1>
                </div>

                {product._hasVariants ? (
                    <>
                        <div className="flex gap-3 overflow-auto w-96 mx-auto hide-scrollbar flex-wrap">
                            {product.variants.map((variant, i) => (
                                <VariantButton name="variants" id={variant._specId} key={variant._specId} variant={variant} checked={selVariant == i} onChange={() => setSelVariant(i)} />))
                            }
                        </div>
                        <h2 className='font-medium text-lg'>₹{product.variants[selVariant!].price}</h2>
                    </>
                ) : (
                    <h2 className='font-medium text-lg'>₹{product.price}</h2>
                )}

                <button className='mt-1 px-3 py-2 border-2 border-blue-400 rounded-full font-semibold text-blue-400 hover:bg-blue-400 hover:text-white transition'
                    onClick={() => addToCart({ itemId: product._id, itemVariant: variantId, quantity: 1 })}>
                    Add to Cart!
                </button>
            </div>
        </div>
    )
};

export default ProductPreview;