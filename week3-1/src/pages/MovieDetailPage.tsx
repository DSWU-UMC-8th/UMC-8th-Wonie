import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  tagline: string;
  overview: string;
  backdrop_path: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export const MovieDetailPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieRes = await axios.get<Movie>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        const creditRes = await axios.get<{ cast: Cast[] }>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovie(movieRes.data);
        setCast(creditRes.data.cast);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg text-gray-500">로딩중...</span>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg text-red-500">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="relative bg-black">
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-[400px] object-cover rounded-xl"
        />
        <div className="absolute top-0 left-0 w-full h-[400px] bg-black/50 rounded-xl flex items-end">
          <div className="p-6 max-w-xl h-[400px] bg-black/60 rounded-br-xl">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <p className="text-sm text-gray-300 mb-1">
                평균 {movie.vote_average}
            </p>
            <p className="text-sm text-gray-300 mb-1">
                {movie.release_date.slice(0, 4)}년
            </p>
            <p className="text-sm text-gray-300 mb-4">
                {movie.runtime}분
            </p>
            {movie.tagline && (
              <p className="itali text-xl mb-3">"{movie.tagline}"</p>
            )}
            <p className="text-sm leading-relaxed">{movie.overview}</p>
          </div>
        </div>
      </div>

      <div className="bg-black pb-[5%]">
        <h2 className="text-2xl font-bold mb-3 p-8">감독 / 출연</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {cast.slice(0, 15).map((member) => (
            <div key={member.id} className="text-center">
              <img
                src={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                    : "https://via.placeholder.com/185x278?text=No+Image"
                }
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-2 border-2 border-amber-50"
              />
              <p className="text-sm font-medium">{member.name}</p>
              <p className="text-xs text-gray-400">{member.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
