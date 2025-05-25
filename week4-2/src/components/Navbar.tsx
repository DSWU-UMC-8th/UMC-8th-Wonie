import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { getMyInfo } from "../apis/auth";
import useLogout from "../hooks/mutation/useLogout";

const Navbar = () => {
  const navigate = useNavigate();
  const { accessToken, user, setUser } = useAuth();

  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleMypage = () => {
    navigate("/mypage");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMyInfo();
        setUser(res.data);

        // localStorage에도 저장
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (error) {
        console.error("사용자 정보 불러오기 실패", error);
      }
    };

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (accessToken) {
      fetchUser();
    }
  }, [accessToken, setUser]);

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-2xs bg-black/90 p-0">
      <div
        onClick={() => navigate("/")}
        className="text-xl font-bold text-white cursor-pointer"
      >
        App
      </div>

      <div className="flex items-center gap-4">
        {accessToken ? (
          <>
            <span className="text-sm text-white">
              {user?.name ?? "사용자"}님 반갑습니다
            </span>
            <button
              onClick={handleMypage}
              className="text-sm text-white hover:text-gray-300 cursor-pointer"
            >
              마이페이지
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-white hover:text-gray-300 cursor-pointer"
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
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
