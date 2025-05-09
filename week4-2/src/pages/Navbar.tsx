import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b shadow-sm">
      <div
        onClick={() => navigate("/")}
        className="text-xl font-bold text-white cursor-pointer"
      >
        App
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-white hover:text-600 cursor-pointer"
        >
          로그인
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
        >
          회원가입
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
