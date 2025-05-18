import { useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/commons";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import LPModal from "../components/LPModal";

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  // const {data, isPending, isError } = useGetLpList({order});
  const [search, setSearch] = useState("");
  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(3, search, order);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      if (!isFetching && hasNextPage) {
        fetchNextPage();
      }
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isPending) {
    return <LpCardSkeletonList count={20} />;
  }

  if (isError) {
    <div className={"mt-20"}>Error</div>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex justify-end p-4 gap-5 items-center">
        <input
          className="p-3 rounded bg-gray-800 text-white w-64"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어를 입력하세요"
          autoFocus
        />

        <div className="flex rounded border border-gray-400 overflow-hidden">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={`w-50% px-4 py-2 text-sm font-medium 
                            ${
                              order === PAGINATION_ORDER.asc
                                ? "bg-gray-100 text-black"
                                : "bg-black text-white"
                            }
                        `}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={`w-50% px-4 py-2 text-sm font-medium
                            ${
                              order === PAGINATION_ORDER.desc
                                ? "bg-gray-100 text-black"
                                : "bg-black text-white"
                            }
                        `}
          >
            최신순
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-6 bg-black text-white">
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        {isFetching && <LpCardSkeletonList count={20} />}
      </div>
      <div ref={ref} className="h-2"></div>

      {/* ✅ LP 작성 모달 버튼 */}
      {open && <LPModal onClose={() => setOpen(false)} />}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 bg-pink-500 w-14 h-14 rounded-full text-white text-3xl shadow-lg hover:bg-pink-600 z-50"
      >
        +
      </button>
    </div>
  );
};

export default HomePage;
