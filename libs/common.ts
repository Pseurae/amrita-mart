import { Variants } from "framer-motion";

export const PopupAnimationVariants: Variants = {
    hidden: { y: '50%', opacity: 0 },
    visible: { y: '0%', opacity: 1 },
    exit: { y: '50%', opacity: 0 }
};

export const formatDate = (date: number) => new Date(date).toLocaleDateString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', month: 'long', day: 'numeric' });
