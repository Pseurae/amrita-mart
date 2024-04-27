import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

import { motion } from "framer-motion";
import { MouseEvent } from "react";
import { PopupAnimationVariants } from "@/libs/common";

interface ConfirmBoxProps { 
    closeDialog: (e: MouseEvent) => void 
};

export default function ConfirmBox({ closeDialog }: ConfirmBoxProps ) {
    return (
        <motion.div variants={PopupAnimationVariants} initial="hidden" animate="visible" exit="exit" transition={{ ease: 'easeInOut' }} className="bg-gradient-to-b rounded-xl shadow-lg from-[#38ef7d] to-[#11998e]">
            <div className="m-2 bg-white rounded-lg z-50 p-12 flex flex-col gap-3">
                <FontAwesomeIcon className="fa-5x" icon={faTriangleExclamation} />
                <div className="mb-3">
                    <h1 className="text-center text-2xl mb-2 font-semibold">Please confirm your order.</h1>
                    <h2 className="text-center text-lg font-medium text-black text-opacity-60">You cannot make modifications to this order later on.</h2>
                </div>

                <button type="submit" id="#confirm" className="transition border-2 border-green-400 hover:text-white hover:bg-green-400 font-semibold rounded-full py-2">
                    Confirm
                </button>
                <button type="button" id="#close" className="transition border-2 border-red-400 hover:text-white hover:bg-red-400 font-semibold rounded-full py-2" onClick={closeDialog}>
                    Close
                </button>
            </div>
        </motion.div>
    )
}