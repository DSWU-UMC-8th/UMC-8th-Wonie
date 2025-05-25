

/*import { useMutation } from "@tanstack/react-query";
import { updateMyInfo } from "../../apis/auth";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useUpdateMyInfo() {
  return useMutation({
    mutationFn: updateMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}

export default useUpdateMyInfo;*/

import { useMutation } from "@tanstack/react-query";
import { updateMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";
import { ResponseMyInfoDto } from "../../types/auth";

function useUpdateMyInfo() {
  return useMutation({
    mutationFn: updateMyInfo,

    onMutate: async (newInfo) => {

      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });


      const previousData = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);

     
      if (previousData) {
        const optimisticData: ResponseMyInfoDto = {
          ...previousData,
          data: {
            ...previousData.data,
            name: newInfo.name,
            bio: newInfo.bio,
            avatar: newInfo.avatar,
          },
        };

        queryClient.setQueryData([QUERY_KEY.myInfo], optimisticData);
      }

      return { previousData };
    },


    onError: (err, newInfo, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousData);
      }
    },

   
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}

export default useUpdateMyInfo;


