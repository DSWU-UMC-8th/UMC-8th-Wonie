import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { calculateTotals } from "./features/Cart/CartSlice";
import CartList from "./components/CartList";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen">
      <CartList />
    </div>
  );
}

export default App;
