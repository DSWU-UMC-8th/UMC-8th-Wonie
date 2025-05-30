import { CartSlice } from "../features/Cart/CartSlice";
import { ModalSlice } from "../features/Modal/modalSlice";

const ModalButton = () => {
  const clearCart = CartSlice((state) => state.clearCart);
  const closeModal = ModalSlice((state) => state.closeModal);

  return (
    <div className="flex justify-center gap-4 mt-5">
      <button
        onClick={() => {
          clearCart();
          closeModal();
        }}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none"
      >
        네
      </button>
      <button
        onClick={closeModal}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none"
      >
        아니요
      </button>
    </div>
  );
};

export default ModalButton;
