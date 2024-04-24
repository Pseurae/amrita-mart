import { Variants, motion } from 'framer-motion'
import { useCallback, useLayoutEffect, useRef } from "react";
import { ModalProps } from "./modalprops";

type ModalWrapperProps = Omit<ModalProps, 'isModalOpen'>;

const ModalOverlayAnimationVariants: Variants = {
    hidden: { opacity: 0, },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

export const ModalWrapper = ({ children, closeModal, parentStyles, overlayStyles, ...props }: ModalWrapperProps) => {
    const parentRef = useRef<HTMLDivElement>(null!);

    const listener = useCallback((e: KeyboardEvent) => {
        if (e.key == "Escape" || e.keyCode == 27) closeModal();
    }, []);

    useLayoutEffect(() => {
        if (document.body.clientHeight == document.body.scrollHeight) return;

        setTimeout(() => document.body.classList.add('modal-open'));
        return () => document.body.classList.remove('modal-open');
     }, []);

    useLayoutEffect(() => {
        setTimeout(() => window.addEventListener('keydown', listener));
        return () => window.removeEventListener('keydown', listener);
    }, []);

    return (
        <div ref={parentRef} className={`fixed h-screen w-full z-50 top-0 left-0 ${parentStyles}`}>
            <motion.div className={`w-full h-full absolute -z-10 ${overlayStyles}`} onClick={() => closeModal()} {...props} variants={ModalOverlayAnimationVariants} initial="hidden" animate="visible" exit="exit" />
            {children}
        </div>
    );
}