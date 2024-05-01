import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Genre } from "../utils/types";
import GenreFilter from "./GenreFilter";
import { useFilterDialogContext } from "../contexts/FilterDialogContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FilterDialogProps = {
  allGenres: Genre[];
};

export default function FilterDialog({ allGenres }: FilterDialogProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [filters, setFilters] = useState<any[]>([]);
  const { isOpen, setIsOpen } = useFilterDialogContext();
  //get `with_genres` urlparams (if any) and convert to number array
  const URLParamsFiltersArray = searchParams
    .get("with_genres")
    ?.split(",")
    .map((filter) => Number(filter));

  useEffect(() => {
    //if with_genres params exists, set filters to that, otherwise empty the filters.
    if (URLParamsFiltersArray) {
      setFilters(URLParamsFiltersArray);
    } else {
      setFilters([]);
    }
  }, [searchParams, isOpen]);

  const handleSelectGenre = (genreID: number) => {
    //remove selected filter in filters if it exists, otherwise add
    if (filters.includes(genreID)) {
      setFilters(filters.filter((filter) => filter !== genreID));
    } else {
      setFilters([...filters, genreID]);
    }
  };

  //this function returns:
  //true if [1,2,3]===[1,2,3,4] false if [1,2,3]===[3,2,1]
  //true if URLParamsFiltersArray is undefined
  function checkArrayInequality(
    URLParamsFiltersArray: number[] | undefined,
    filters: number[]
  ) {
    if (URLParamsFiltersArray) {
      if (URLParamsFiltersArray!.length !== filters.length) return true;
      URLParamsFiltersArray!.sort();
      filters.sort();
      for (let i = 0; i < URLParamsFiltersArray!.length; i++) {
        if (URLParamsFiltersArray![i] !== filters[i]) return true;
      }
      return false;
    } else {
      return true;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="bg-gray-950 border-gray-950">
        <DialogHeader>
          <DialogTitle className="text-white flex justify-between items-center pt-2">
            <p>Select Filters</p>
            <button
              disabled={filters.length === 0}
              onClick={() => setFilters([])}
              type="button"
              className={`py-2 px-4 ${
                filters.length === 0 ? "bg-gray-400/50" : "bg-gray-400"
              } text-black text-base rounded-full font-medium`}
            >
              Clear Filters
            </button>
          </DialogTitle>
          <div className="flex flex-wrap items-center py-8 gap-2">
            {allGenres.map((genre) => {
              return (
                <GenreFilter
                  key={genre.id}
                  isGenreSelected={filters.includes(genre.id)}
                  genre={genre}
                  handleSelectGenre={() => handleSelectGenre(genre.id)}
                ></GenreFilter>
              );
            })}
          </div>
        </DialogHeader>
        <DialogFooter>
          <button
            onClick={() => {
              try {
                //1. if filters.length!==0 and arrays are unequal, this means there are filters,
                //but current filters are different from prev filters, so apply current filters
                //2.if filters.length!==0 and arrays are equal, this means there are filters,
                //and prev and current filters are the same, so just close the dialog to avoid unnecessary fetch.
                //3.if filters.length===0 and arrays are unequal, this means with_genres in url has filters
                //but user cleared filters in the dialog, so clear filters by deleting with_genres in urlsearchparams.
                if (checkArrayInequality(URLParamsFiltersArray, filters)) {
                  if (filters.length !== 0) {
                    params.set("with_genres", filters.join(","));
                  } else {
                    params.delete("with_genres");
                  }
                }
              } catch (e) {
                throw new Error(`${e}`);
              } finally {
                router.push(`${pathname}?${params.toString()}`);
                setIsOpen(false);
              }
            }}
            className="bg-purple-500 py-2 px-4 text-white rounded-full w-full"
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
