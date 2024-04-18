type ModalProps = {
    children: React.ReactNode;
    isModalOpen: boolean,
    closeModal: () => void;
    parentStyles?: string;
};

const Modal = ({ children, isModalOpen, closeModal, parentStyles = "" } : ModalProps) => {
    if (!isModalOpen) return null;

    return (
        <div className={"fixed h-screen w-full z-50 top-0 left-0 " + parentStyles}>
            <div className="w-full h-full absolute -z-10" onClick={() => closeModal()} />
            {children}
        </div>
    );
}

export default Modal;