/*import {useMutation} from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function usePostLike() {
  return useMutation({
    mutationFn: postLike,

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,
      })
    },

    onError: (error, variables, context) => {},
    onMutate: (variables) => {
      console.log("hi");
    },

    onSettled: (data, error, variables, context) => {}
  })
}

export default usePostLike;*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";

const usePostLike = (lpId: number, userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postLike({ lpId }),
    onMutate: async () => {
      await queryClient.cancelQueries(["lpDetail", lpId]);
      const previous = queryClient.getQueryData(["lpDetail", lpId]);

      queryClient.setQueryData(["lpDetail", lpId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            likes: [...old.data.likes, { userId }],
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

export default usePostLike;
