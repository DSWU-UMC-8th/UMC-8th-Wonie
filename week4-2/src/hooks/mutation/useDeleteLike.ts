/*import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,
      });
    },
  });
}

export default useDeleteLike;*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";

const useDeleteLike = (lpId: number, userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteLike({ lpId }),
    onMutate: async () => {
      await queryClient.cancelQueries(["lpDetail", lpId]);
      const previous = queryClient.getQueryData(["lpDetail", lpId]);

      queryClient.setQueryData(["lpDetail", lpId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            likes: old.data.likes.filter((like: any) => like.userId !== userId),
          },
        };
      });

      return { previous };
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["lpDetail", lpId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["lpDetail", lpId]);
    },
  });
};

export default useDeleteLike;
