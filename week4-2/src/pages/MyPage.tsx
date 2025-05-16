import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    <div className="h-screen bg-black text-white">
      <Navbar />
      <div className="flex flex-col items-center gap-y-4 mt-10 h-[63%]">
        <img
          src={data?.avatar || "/vite.svg"}
          alt="프로필 이미지"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <h1 className="text-2xl font-semibold">{data?.name}님 환영합니다.</h1>
        <p className="text-lg">{data?.email}</p>
        <button
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition-all cursor-pointer"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default MyPage;
