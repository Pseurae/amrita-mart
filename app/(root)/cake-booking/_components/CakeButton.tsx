import { InputHTMLAttributes } from "react";
import { Cake } from "../_lib/common";

interface CakeButtonProps {
    cake: Cake;
};

export default function ({ cake, ...props }: CakeButtonProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <label className="flex flex-col select-none items-center rounded-lg overflow-clip border transition duration-200 ease-in-out has-[:checked]:text-red-400 has-[:checked]:border-red-400 has-[:checked]:bg-pink-50">
            <input className="hidden" type="radio" name="type" value={cake._id} {...props} />
            <img className="w-full h-32 object-cover" src={'images/cake/' + cake.path} alt="" />
            <div className="px-5 py-2">
                <h1 className="text-center font-medium">{cake.title}</h1>
                <h2 className="text-center">₹{cake.price}/kg</h2>
            </div>
        </label>
    )
}