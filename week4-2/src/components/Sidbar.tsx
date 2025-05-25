import { Link } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import useDeleteUser from "../hooks/mutation/useDeleteUser"; // ✅ 탈퇴 훅
import ConfirmModal from "./ConfirmModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteUser = useDeleteUser();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!isOpen) return;
      if (ref.current && !e.composedPath().includes(ref.current)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  const handleWithdraw = () => {
    setShowConfirm(true);
  };

  const handleConfirmYes = () => {
    deleteUser.mutate();
    setShowConfirm(false);
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <aside
        ref={ref}
        className={`
          w-56 h-full bg-black/90 text-white p-6 shadow-md
          ${isOpen ? "block" : "hidden"}
          md:block
        `}
      >
        <div className="text-white">
          <button className="flex items-center gap-3 hover:text-blue-600 mt-5">
            <FaSearch /> 찾기
          </button>
        </div>

        <Link
          to="/mypage"
          className="flex items-center gap-3 hover:text-blue-600 mt-7"
        >
          <FaUser /> 마이페이지
        </Link>

        <button
          onClick={handleWithdraw}
          className="mt-10 text-sm text-left text-gray-300 hover:text-red-400"
        >
          탈퇴하기
        </button>
      </aside>

      {showConfirm && (
        <ConfirmModal
          message="정말 탈퇴하시겠습니까?"
          onConfirm={handleConfirmYes}
          onCancel={handleConfirmNo}
        />
      )}
    </>
  );
};

export default Sidebar;
