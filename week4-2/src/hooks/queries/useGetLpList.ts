import { useQuery } from "@tanstack/react-query";
import { PaginationDto } from "../../types/common.ts";
import { getLpList } from "../../apis/lp.ts";
import { QUERY_KEY } from "../../constants/key.ts";
import { ResponseLpListDto } from "../../types/lp.ts";

const initialLpListData: ResponseLpListDto = {
  status: true,
  statusCode: 200,
  message: "",
  data: {
    data: [],
  },
  nextCursor: 0,
  hasNext: false,
};

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),
    //데이터가 신선하다고 간주하는 시간
    //이 시간 동안은 캐시된 데이터를 그대로 사용합니다.
    //5분 동안 기존 데이터를 그대로 사용해서 네트워크 요청을 줄인다.
    staleTime: 1000 * 60 * 5, //5분

    //사용되지 않는 (비활성 상태)인 쿼리 데이터가 캐시에 남아있는 시간
    //staleTime이 지나고 데이터가 신선하지 않더라도, 일정 시간 동안 메모리에 보관
    //그 이후에 해당 쿼리가 전혀 사용되지 않으면 gcTime이 지난 후에 제거한다. (grabage collection)
    //예) 10분 동안 사용되지 않으면 해당 캐시 데이터가 삭제되어, 다시 요청 시 새 데이터를 받아오게 합니다.
    gcTime: 100 * 60 * 10, //10분

    // //조건에 따라 쿼리를 실행 여부 제어
    // enabled: Boolean(search),

    // refetchInterval: 100 * 60, //10초마다 랭킹 데이터 fetch

    //쿼리 요청이 실패했을 때 자동으로 재시도할 횟수를 지정합니다.
    //기본 값은 3회정도, 네트워크 오류 등 임시적인 문제를 보완할 수 있음
    // retry: 3,

    //initialData = 쿼리 실행 전 미리 제공할 초기 데이터를 설정합니다.
    //컴포넌트가 랜더링 될 때 빈 데이터 구조를 미리 제공해서, 로딩 전에도 안전하게 UI를 구성할 수 있게 해줌
    // initialData: initialLpListData,

    select: (data: ResponseLpListDto) => data.data.data,
  });
}

export default useGetLpList;
