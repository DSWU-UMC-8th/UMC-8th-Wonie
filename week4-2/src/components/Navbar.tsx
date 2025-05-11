import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleMypage = async () => {
    window.location.href = "/mypage";
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-2xs bg-black/90 p-0">
      <div
        onClick={() => navigate("/")}
        className="text-xl font-bold text-white cursor-pointer"
      >
        App
      </div>

      <div className="flex gap-4">
        {accessToken ? (
          <>
            <button
              onClick={handleMypage}
              className="text-sm text-white hover:text-gray-300 cursor-pointer"
            >
              마이페이지
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-white hover:text-gray-300 cursor-pointer"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-white hover:text-gray-300 cursor-pointer"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
