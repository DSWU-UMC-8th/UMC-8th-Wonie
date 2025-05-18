import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../../apis/user";
import { useNavigate } from "react-router-dom";

const useDeleteUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/"); // 홈 또는 로그인 페이지로
    },
    onError: () => {
      alert("탈퇴 중 오류가 발생했습니다.");
    },
  });
};

export default useDeleteUser;
