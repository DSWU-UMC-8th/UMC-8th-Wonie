import { useParams } from "react-router-dom";
import { MovieDetailResponse } from "../types/movie";
import { CastResonse } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";

const MovieDetailPage = () => {
  const { movieId } = useParams();

  const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}`;
  const creditUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits`;

  const {
    data: movie,
    isPending,
    isError,
  } = useCustomFetch<MovieDetailResponse>(detailUrl, "ko-KR");
  const { data: cast } = useCustomFetch<CastResonse>(creditUrl, "ko-KR");

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <>
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      <div className="text-white">
        <div className="relative bg-black">
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie?.backdrop_path}`}
            alt={movie?.title}
            className="w-full h-[400px] object-cover rounded-xl"
          />
          <div className="absolute top-0 left-0 w-full h-[400px] bg-black/50 rounded-xl flex items-end">
            <div className="p-6 max-w-xl h-[400px] bg-black/60 rounded-br-xl">
              <h1 className="text-3xl font-bold mb-4">{movie?.title}</h1>
              <p className="text-sm text-gray-300 mb-1">
                평균 {movie?.vote_average}
              </p>
              <p className="text-sm text-gray-300 mb-1">
                {movie?.release_date.slice(0, 4)}년
              </p>
              <p className="text-sm text-gray-300 mb-4">{movie?.runtime}분</p>
              {movie?.tagline && (
                <p className="italic text-xl mb-3">"{movie?.tagline}"</p>
              )}
              <p className="text-sm leading-relaxed">{movie?.overview}</p>
            </div>
          </div>
        </div>

        <div className="bg-black pb-[5%]">
          <h2 className="text-2xl font-bold mb-3 p-8">감독 / 출연</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 px-12">
            {cast?.cast.slice(0, 15).map((member) => (
              <div key={member.id} className="text-center">
                <div
                  className="w-[120px] h-[120px] overflow-hidden rounded-full border-2 border-white"
                  key={member.id}
                >
                  {member.profile_path === null ? (
                    <div className="bg-gray-200 w-full h-full"></div>
                  ) : (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                      className="object-cover w-full h-full"
                      alt="프로필 이미지"
                    />
                  )}
                </div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-gray-400">{member.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetailPage;
