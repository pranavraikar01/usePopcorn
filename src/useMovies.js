import { useEffect, useState, useRef } from "react";

const KEY = `cdc2da49`;
export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error(
              "something went wrong DUE TO NO INTERNET CONNECTION"
            );
          const data = await res.json();
          if (data.Response === "False")
            throw new Error("QUERRY FOR THE MOVIE IS INVALID");
          setMovies(data.Search);
          setError("");
          // .then((res) => res.json())
          // .then((data) => setMovies(data.Search));
          // console.log(data.Search);

          setIsLoading(false);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
          setError(err.message);
        }
      }

      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
