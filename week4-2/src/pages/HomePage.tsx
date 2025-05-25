import { useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/commons";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import useSearchLpList from "../hooks/queries/useSearchLpList";
import useDebounce from "../hooks/useDebounce";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import LPModal from "../components/LPModal";

import { useThrottle } from "../hooks/useThrottle"; // ✅ 추가

const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_DELAY = 500;

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);
  const searchMode = debouncedSearch.trim().length >= MIN_SEARCH_LENGTH;

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(3, searchMode ? "" : debouncedSearch, order);

  const { data: searchResult, isFetching: isSearching } = useSearchLpList(
    debouncedSearch,
    searchMode
  );

  const { ref, inView } = useInView({ threshold: 0 });

  const throttledFetchNextPage = useThrottle(() => {
    if (!isFetching && hasNextPage) {
      console.log("throttled fetchNextPage 호출");
      fetchNextPage();
    }
  }, 2000); // ✅ 3초에 한 번만 허용

  useEffect(() => {
    if (!searchMode && inView) {
      throttledFetchNextPage();
    }
  }, [inView, searchMode, throttledFetchNextPage]);

  if (isPending) return <LpCardSkeletonList count={20} />;
  if (isError) return <div className="mt-20">Error</div>;

  const renderLps = () => {
    const items = searchMode
      ? searchResult?.data?.data || []
      : lps?.pages?.flatMap((page) => page.data.data) || [];

    return items.map((lp) => <LpCard key={lp.id} lp={lp} />);
  };

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
            className={`w-50% px-4 py-2 text-sm font-medium ${
              order === PAGINATION_ORDER.asc
                ? "bg-gray-100 text-black"
                : "bg-black text-white"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={`w-50% px-4 py-2 text-sm font-medium ${
              order === PAGINATION_ORDER.desc
                ? "bg-gray-100 text-black"
                : "bg-black text-white"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-6 bg-black text-white">
        {renderLps()}
        {(isFetching || isSearching) && <LpCardSkeletonList count={20} />}
      </div>

      {!searchMode && <div ref={ref} className="h-2" />}

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
