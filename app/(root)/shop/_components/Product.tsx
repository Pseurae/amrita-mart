"use client"

import { HTMLAttributes } from 'react';
import { Product as ProductType } from '@/types/product'
import PlaceholderBar from "@/components/PlaceholderBar";
import Image from 'next/image';
import { ProductImage } from '@/libs/products';

const getPreviewPrice = (product: ProductType) => {
    if (product._hasVariants) {
        const sortedVariants = product.variants.toSorted((t1, t2) => { return t1.price - t2.price; });

        const first = sortedVariants.at(0)!;
        const last = sortedVariants.at(-1)!;

        if (first.price == last.price)
            return '₹' + last.price;

        return '₹' + first.price + ' - ' + '₹' + last.price;
    }

    return '₹' + product.price;
};

export const Product = ({ product, ...props }: { product: ProductType } & Omit<HTMLAttributes<HTMLDivElement>, 'className'>) => {
    const previewImage = product._hasVariants ? product.variants[product.defaultVariant].image : product.image;

    return (
        <div {...props} className='cursor-pointer border rounded-lg bg-white overflow-clip flex flex-col group transition ease-in-out ease-in-out hover:text-red-400 hover:border-red-400 hover:bg-pink-50 hover:shadow-lg hover:shadow-pink-100/75' >
            <div className='mb-auto h-64 overflow-hidden place-content-center bg-white relative'>
                <Image fill className='h-full w-full object-cover group-hover:scale-105 transition ease-in-out duration-200' src={ProductImage(previewImage)} alt={previewImage} />
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
            <PlaceholderBar className='font-bold' />
            <PlaceholderBar className='font-bold' />
        </div>
    </div>
)