// import LpCard from "../components/LpCard/LpCard.tsx";
// import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList.tsx";
// import { PAGINATION_ORDER } from "../enums/commons.ts";
// import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList.ts";
// import { useEffect, useState } from "react";
// import { useInView } from "react-intersection-observer";

// const HomePage = () => {
//   const [search, setSearch] = useState("");
//   // const { data, isPending, isError } = useGetLpList({ search, limit: 50 });
//   const {
//     data: lps,
//     isFetching,
//     hasNextPage,
//     fetchNextPage,
//     isError,
//     isPending,
//   } = useGetInfiniteLpList(10, search, PAGINATION_ORDER.desc);

//   const { ref, inView } = useInView({
//     threshold: 0,
//   });

//   useEffect(() => {
//     if (inView) {
//       !isFetching && hasNextPage && fetchNextPage();
//     }
//   }, [inView, isFetching, hasNextPage, fetchNextPage]);

//   if (isError) {
//     return <div className="mt-20">Error...</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <input value={search} onChange={(e) => setSearch(e.target.value)} />

//       <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {isPending && <LpCardSkeletonList count={20} />}
//         {lps?.pages
//           ?.map((page) => page.data.data)
//           ?.flat()
//           ?.map((lp) => (
//             <LpCard key={lp.id} lp={lp} />
//           ))}
//         {isFetching && <LpCardSkeletonList count={20} />}
//       </div>
//       <div ref={ref} className="h-2"></div>
//     </div>
//   );
// };

// export default HomePage;

import { useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/commons";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import Footer from "../components/Footer";

const HomePage = () => {
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
  } = useGetInfiniteLpList(3, search, PAGINATION_ORDER.desc);

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
    </div>
  );
};

export default HomePage;
