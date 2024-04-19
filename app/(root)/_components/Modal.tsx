import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type ModalProps = {
    children: React.ReactNode;
    isModalOpen: boolean,
    closeModal: () => void;
    parentStyles?: string;
};

const ModalWrapper = ({ children, closeModal, parentStyles="" }: Omit<ModalProps, 'isModalOpen'>) => {
    const parentRef = useRef<HTMLDivElement>(null!);

    const listener = useCallback((e: MouseEvent) => {
        if (e.target == parentRef?.current)
            closeModal();
    }, []);

    useLayoutEffect(() => {
        setTimeout(() => window.addEventListener('click', listener));
        return () => window.removeEventListener('click', listener);
    }, []);

    return (
        <div ref={parentRef} className={"fixed h-screen w-full z-50 top-0 left-0 " + parentStyles}>
            {/* <div className="w-full h-full absolute -z-10" onClick={() => closeModal()} /> */}
            {children}
        </div>
    );
}

const Modal = ({ children, isModalOpen, closeModal, parentStyles = "" } : ModalProps) => {
    if (!isModalOpen) return null;

    return (
        isModalOpen ? (<ModalWrapper closeModal={closeModal} parentStyles={parentStyles}>{children}</ModalWrapper>) : null
    );
}

export default Modal;