import { useCallback, useEffect, useRef } from "react";

interface ProfileDropdownProps {
    children: React.ReactNode;
    close: () => void;
};

export default function ProfileDropdown ({ children, close }: ProfileDropdownProps) {
    const wrapperRef = useRef<HTMLDivElement>(null!);

    const onClick = useCallback((e: MouseEvent) => {
        console.log("Test");
        if (!wrapperRef.current?.contains(e.target as Node)) { 
            close(); 
        }
    }, [close]);

    useEffect(() => {
        setTimeout(() => window.addEventListener('click', onClick));
        return () => window.removeEventListener('click', onClick);
    }, [onClick]);

    return (
        <div className="min-w-56 mt-[4.5rem] absolute bg-white top-0 right-0 w-fit border rounded-lg">
            <div ref={wrapperRef} className="flex flex-col shadow-lg">
                {children}
            </div>
        </div>
    );
}