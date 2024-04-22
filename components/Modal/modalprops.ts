export interface ModalProps {
    children: React.ReactNode;
    isModalOpen: boolean,
    closeModal: () => void;
    parentStyles?: string;
    overlayStyles?: string;
};