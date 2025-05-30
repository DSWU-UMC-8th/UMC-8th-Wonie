import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: React.ReactNode;
}

const ModalPortal = ({ children }: ModalPortalProps) => {
  if (typeof window === "undefined") return null;

  const node = document.getElementById("portal");
  return node ? createPortal(children, node) : null;
};

export default ModalPortal;
