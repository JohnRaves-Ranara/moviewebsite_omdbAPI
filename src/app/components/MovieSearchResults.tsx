import { IconFilterFilled } from "@tabler/icons-react";
import { Movie } from "../types";
import MovieCard from "./MovieCard";
import MoviePoster from "./MoviePoster";

type MovieSearchResultsProps = {
  movies: Movie[];
  inputQuery: string;
};

export default function MovieSearchResults({
  movies,
  inputQuery,
}: MovieSearchResultsProps) {
  return (
    <div className="min-h-screen bg-gray-950 pt-[18vh] px-24 pb-24 ">
      <div className="flex gap-8 items-center mb-5">
        <h1 className="text-white text-[2.5vw] overflow-hidden before:block before:h-8 before:w-1 before:bg-purple-500 flex items-center gap-4">
          Showing results for "{inputQuery}"
        </h1>
        <div className="px-6 py-2 bg-purple-500 rounded-full flex items-center gap-3 hover:bg-purple-800 group">
            <p className="text-white">Filter</p>
            <IconFilterFilled color="white" size={25}/>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-16 text-white">
        {movies.map((movie) => {
          return (
            <div key={movie.id} className="flex flex-col gap-4">
              <MovieCard movie={movie} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
