import { motion } from "framer-motion";
import { PopupAnimationVariants, formatDate } from "@/libs/common";

export function OrderPreview({ children, title, orderId, date } : { children: React.ReactNode, title: string, orderId: string, date: number }) {
    return (
        <motion.div className="p-12 bg-white shadow-lg"
            variants={PopupAnimationVariants} initial="hidden" animate="visible" exit="exit" transition={{ ease: 'easeInOut' }} 
        >
            <h1 className="font-bold font-serif text-3xl text-center">{title}</h1>

            <br />

            <h1>ID: <span className="font-semibold">{orderId}</span></h1>
            <h1>Ordered on: <span className="font-semibold">{formatDate(date)}</span></h1>

            <br />

            {children}
        </motion.div>
    )
}