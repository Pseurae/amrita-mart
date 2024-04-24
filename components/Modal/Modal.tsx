import { AnimatePresence } from "framer-motion";
import { ModalWrapper } from './ModalWrapper'
import { ModalProps } from "./modalprops";

const Modal = ({ children, isModalOpen, closeModal, parentStyles="", overlayStyles="" } : ModalProps) => {
    return (
        <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
            { isModalOpen && (<ModalWrapper closeModal={closeModal} parentStyles={parentStyles} overlayStyles={overlayStyles}>{children}</ModalWrapper>) }
        </AnimatePresence>
    );
}

export default Modal;