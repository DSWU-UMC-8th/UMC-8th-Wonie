import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto["data"]>({
    name: "",
    email: "",
    bio1: "",
    bio2: "",
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const response: ResponseMyInfoDto = await getMyInfo();
      console.log(response);
      setData(response.data);
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="h-[100vh]">
      <h1 className="text-white">{data?.name}님 환영합니다.</h1>
      <img src={data?.avatar || "/vite.svg"} alt="프로필 이미지" />

      <button
        className="cursor-pointer bg-blue-600 rounded-sm p-3 text-white hover:scale-90"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
