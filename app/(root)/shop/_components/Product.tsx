"use client"

import { HTMLAttributes } from 'react';
import { Product as ProductType, imagePath } from '../../../_types/product'
import { getPreviewPrice } from '../_lib/common';

export const Product = ({ product, ...props }: { product: ProductType } & HTMLAttributes<HTMLDivElement>) => {
    const previewImage = product._hasVariants ? product.variants[product.defaultVariant].image : product.image;

    return (
        <div {...props} className='cursor-pointer border rounded-lg bg-white overflow-clip flex flex-col group transition ease-in-out ease-in-out hover:text-red-400 hover:border-red-400 hover:bg-pink-50' >
            <div className='mb-auto h-64 overflow-hidden place-content-center bg-white'>
                <img className='h-full w-full object-cover group-hover:scale-105 transition ease-in-out duration-200' src={imagePath(previewImage)} alt={previewImage} />
            </div>
            <div className='px-5 py-3'>
                <h1 className='font-bold'>{product.name}</h1>
                <h2 className='font-medium'>{getPreviewPrice(product)}</h2>
            </div>
        </div>
    )
}

export const Placeholder = () => (
    <div className='border rounded-lg overflow-clip flex flex-col animate-pulse bg-white' >
        <div className='mb-auto h-64 overflow-hidden place-content-center bg-white'>
            <div className="h-full w-full bg-gradient-to-t from-gray-200 to-gray-300"></div>
        </div>
        <div className='px-5 py-3'>
            {/* Pain. */}
            <h1 className='font-bold relative'>
                {"\xa0"}
                <p className='absolute rounded-full top-0 left-0 h-[60%] bg-gray-200 w-full text-sm'>{"\xa0"}</p>
            </h1>
            <h2 className='font-medium relative'>
                {"\xa0"}
                <p className='absolute rounded-full top-0 left-0 h-[60%] bg-gray-200 w-full text-sm'>{"\xa0"}</p>
            </h2>
        </div>
    </div>
)