import { HTMLAttributes } from "react";

const PlaceholderBar = ({ className, ...props } : HTMLAttributes<HTMLHeadingElement>) => {
    return (
        <h1 {...props} className={`${className} relative animate-pulse`}>
            {"\xa0"}
            <p className='absolute translate-y-2/4 rounded-full top-0 left-0 h-[50%] bg-gray-200 w-full'>{"\xa0"}</p>
        </h1>
    )
};

export default PlaceholderBar;