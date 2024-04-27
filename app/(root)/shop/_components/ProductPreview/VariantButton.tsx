import Image from 'next/image';
import { ProductImage } from '@/libs/products';
import { InputHTMLAttributes } from 'react';

const VariantButton = ({ variant, ...props }: { variant: any } & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'>) => (
    <label
        className={'cursor-pointer flex gap-2 px-4 py-2 rounded-full border text-gray-500 border-gray-500 transition has-[:checked]:text-red-400 has-[:checked]:bg-red-50 has-[:checked]:border-red-400'}>
        <input className='hidden' type="radio" {...props} />
        <div className="h-6 w-6 relative">
            <Image fill className='h-full w-full object-cover rounded-full' src={ProductImage(variant.image)} alt={variant.image} />
        </div>
        <h1>{variant.name}</h1>
    </label>
);

export default VariantButton;