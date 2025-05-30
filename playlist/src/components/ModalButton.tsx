import { useDispatch } from "react-redux";
import { clearCart } from "../features/Cart/CartSlice";
import { closeModal } from "../features/Modal/modalSlice";

const ModalButton = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex justify-center gap-4 mt-5">
      <button
        onClick={() => {
          dispatch(clearCart());
          dispatch(closeModal());
        }}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none"
      >
        네
      </button>
      <button
        onClick={() => dispatch(closeModal())}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none"
      >
        아니요
      </button>
    </div>
  );
};

export default ModalButton;
