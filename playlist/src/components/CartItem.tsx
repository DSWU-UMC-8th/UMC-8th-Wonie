import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { increase, decrease, removeItem } from "../features/Cart/CartSlice";

interface CartItemProps {
  id: string;
  title: string;
  singer: string;
  price: number;
  img: string;
  amount: number;
}

function CartItem({ id, title, singer, price, img, amount }: CartItemProps) {
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between items-center border-b border-gray-300 py-3 px-2">
      <div className="flex items-center gap-4">
        <img src={img} alt={title} className="w-14 h-14 rounded object-cover" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          <span className="text-xs text-gray-500">{singer}</span>
          <span className="text-sm text-gray-600">₩ {price}</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <button
          onClick={() => dispatch(increase(id))}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaChevronUp />
        </button>
        <span className="font-bold text-gray-800">{amount}</span>
        <button
          onClick={() => {
            if (amount === 1) {
              dispatch(removeItem(id));
              return;
            }
            dispatch(decrease(id));
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaChevronDown />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
