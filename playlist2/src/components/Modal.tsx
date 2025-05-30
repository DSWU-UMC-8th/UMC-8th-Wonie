import { ModalSlice } from "../features/Modal/modalSlice";
import ModalButton from "./ModalButton";

interface ModalProps {
  children: React.ReactNode;
}

function Modal({ children }: ModalProps) {
  const { isOpen } = ModalSlice();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-[90%] text-center z-50">
        {children}
        <ModalButton />
      </div>
    </div>
  );
}

export default Modal;
