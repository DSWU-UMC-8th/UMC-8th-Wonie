import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";

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

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const response = await getMyInfo();
        setData(response.data);
      } catch (error) {
        console.error("유저 정보 조회 실패:", error);
      }
    };

    fetchMyInfo();
  }, []);

  return (
    <div>
      <strong className="text-white">이름: {data.name}</strong>
    </div>
  );
};

export default MyPage;
