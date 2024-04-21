import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type ModalProps = {
    children: React.ReactNode;
    isModalOpen: boolean,
    closeModal: () => void;
    parentStyles?: string;
    overlayStyles?: string;
};

const CartAnimationVariants = {
    hidden: { opacity: 0, },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const ModalWrapper = ({ children, closeModal, parentStyles, overlayStyles }: Omit<ModalProps, 'isModalOpen'>) => {
    const parentRef = useRef<HTMLDivElement>(null!);

    // const listener = useCallback((e: MouseEvent) => {
    //     if (e.target == parentRef?.current)
    //         closeModal();
    // }, []);

    // useLayoutEffect(() => {
    //     setTimeout(() => window.addEventListener('click', listener));
    //     return () => window.removeEventListener('click', listener);
    // }, []);

    const listener = useCallback((e: KeyboardEvent) => {
        if (e.key == "Escape" || e.keyCode == 27) closeModal();
    }, []);

    useLayoutEffect(() => {
        setTimeout(() => window.addEventListener('keydown', listener));
        return () => window.removeEventListener('keydown', listener);
    }, []);

    return (
        <div ref={parentRef} className={`fixed h-screen w-full z-50 top-0 left-0 ${parentStyles}`}
            // variants={CartAnimationVariants}
            // initial="hidden"
            // animate="visible"
            // exit="exit"
        >
            <motion.div className={`w-full h-full absolute -z-10 ${overlayStyles}`} onClick={() => closeModal()} variants={CartAnimationVariants} initial="hidden" animate="visible" exit="exit" />
            {children}
        </div>
    );
}

const Modal = ({ children, isModalOpen, closeModal, parentStyles="", overlayStyles="" } : ModalProps) => {
    return (
        <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
            { isModalOpen && (<ModalWrapper closeModal={closeModal} parentStyles={parentStyles} overlayStyles={overlayStyles}>{children}</ModalWrapper>) }
        </AnimatePresence>
    );
}

export default Modal;