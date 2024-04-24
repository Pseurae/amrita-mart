import { InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Cake, CakeImage } from "@/libs/cakes";

interface CakeButtonProps {
    cake: Cake;
};

export default function CakeButton ({ cake, ...props }: CakeButtonProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'name' | 'value'>) {
    return (
        <motion.label whileTap={{ scale: 0.9 }} className="cursor-pointer flex flex-col select-none items-center rounded-lg overflow-clip border transition duration-200 ease-in-out has-[:checked]:text-red-400 has-[:checked]:border-red-400 has-[:checked]:bg-pink-50">
            <input className="hidden" type="radio" name="type" value={cake._id} {...props} />
            <div className="w-full h-32 relative">
                <Image fill className="w-full h-full object-cover" src={CakeImage(cake.path)} alt="" />
            </div>
            <div className="px-5 py-2">
                <h1 className="text-center font-medium">{cake.title}</h1>
                <h2 className="text-center">₹{cake.price}/kg</h2>
            </div>
        </motion.label>
    )
}