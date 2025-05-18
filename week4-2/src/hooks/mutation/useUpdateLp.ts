

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLp } from "../../apis/lp";
import { UpdateLpRequest } from "../../types/lp";

const useUpdateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchLp,
    onSuccess: (_, variables) => {
      alert("수정이 완료되었습니다.");
      queryClient.invalidateQueries(["lpDetail", variables.lpId]); // 수정된 LP 다시 불러오기
    },
    onError: (err) => {
      alert("수정에 실패했습니다.");
      console.error(err);
    },
  });
};

export default useUpdateLp;

