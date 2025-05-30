import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateTotals } from "../features/Cart/CartSlice";
import { openModal } from "../features/Modal/modalSlice";
import CartItem from "./CartItem";
import Modal from "./Modal";
import ModalPortal from "./ModalPortal";
import { HiOutlineShoppingBag } from "react-icons/hi";

function CartList() {
  const { cartItems, total, amount } = useSelector((state: any) => state.cart);
  const { isOpen } = useSelector((state: any) => state.modal);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <>
      <header className="bg-black text-white w-full p-4 flex justify-between items-center mb-5">
        <h1 className="text-lg font-bold">UMC PlayList</h1>
        <div className="relative">
          <HiOutlineShoppingBag size={28} />
          <span className="absolute -top-2 -right-2 w-5 h-5 text-xs bg-red-500 text-white flex items-center justify-center rounded-full">
            {amount}
          </span>
        </div>
      </header>

      <div className="w-[90%] max-w-3xl bg-white shadow-md rounded-lg p-5 mx-auto">
        {cartItems.map((item: any) => (
          <CartItem key={item.id} {...item} />
        ))}

        {isOpen && (
          <ModalPortal>
            <Modal>
              <h4 className="text-base font-medium mb-4">
                담아주신 모든 음반을 삭제하시겠습니까?
              </h4>
            </Modal>
          </ModalPortal>
        )}

        <div className="border-t border-gray-300 mt-6 pt-4 flex justify-between items-center">
          <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <span>총 가격</span>
            <span className="text-blue-600">₩ {total}원</span>
          </div>
          <button
            onClick={() => dispatch(openModal())}
            className="bg-red-100 text-red-700 px-4 py-2 text-sm font-medium rounded hover:bg-red-200"
          >
            장바구니 초기화
          </button>
        </div>
      </div>
    </>
  );
}

export default CartList;
