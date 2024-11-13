import "./App.css";
import React, { useState, useEffect, useRef } from "react";

interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  primaryGenreName: string;
  artworkUrl100: string;
}

function App() {
  const [originalData, setOriginalData] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = async (term: string = "pop"): Promise<void> => {
    const searchUrl = `https://itunes.apple.com/search?term=${term}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    setOriginalData(data.results);
  };

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchData(term);
    }, 500);
  };

  const handleReset = () => {
    setSearchTerm("");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <form
        className="max-w-md mx-auto"
        onSubmit={(e: React.FormEvent) => e.preventDefault()}
      >
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
            value={searchTerm}
            onChange={onSearchInput}
          />
          <button
            type="button"
            onClick={handleReset}
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="columns-3 gap-4 p-4">
        {originalData.length > 0 ? (
          originalData.map((item) => (
            <div
              className="max-w-sm rounded overflow-hidden shadow-lg h-30"
              key={item.trackId}
            >
              <div className="px-6 py-4">
                <img src={item.artworkUrl100} alt={item.trackName} />
                <div className="font-bold text-xl mb-2">{item.trackName}</div>
              </div>
              <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {item.artistName}
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {item.collectionName}
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {item.primaryGenreName}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No Results found
          </div>
        )}
      </div>
    </>
  );
}

export default App;
