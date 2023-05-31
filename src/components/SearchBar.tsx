'use client';
import { ViewportContext } from '@/contexts/ViewportContext';
import { ChangeEvent, useCallback, useContext, useState } from 'react';

const debounce = (fn: (val: any) => Promise<void>, time: number) => {
  let timeoutID: number | NodeJS.Timeout | undefined;
  return (arg) => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
      fn(arg);
    }, time);
  };
};

interface Suggestion {
  bbox: number[];
  center: number[];
  context: any[];
  geometry: any;
  id: string;
  matching_place_name: string;
  matching_text: string;
  place_name: string;
  place_type: string[];
  properties: any;
  relevance: number;
  text: string;
  type: string;
}

const SearchBar = () => {
  const { viewport, setViewport } = useContext(ViewportContext);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    makeDebouncedQuery(e.target.value);
  };

  const fetchSuggestions = async (searchValue: string) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchValue}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`
      );
      const { features } = await res.json();
      setSuggestions(features);
    } catch (error) {
      console.log('error sending request');
      console.error(error);
    }
  };

  const searchChange = async (searchValue: string) => {
    fetchSuggestions(searchValue);
  };

  const makeDebouncedQuery = useCallback(
    debounce((val) => searchChange(val), 1500),
    []
  );

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setViewport({
      ...viewport,
      latitude: suggestion.center[1],
      longitude: suggestion.center[0],
    });
  };
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search for local farms..."
        value={searchValue}
        onChange={handleInputChange}
        className="w-full text-emerald-900 p-2 border border-emerald-600 rounded-md focus:border-emerald-900 focus:outline-none"
      />
      {!suggestions.length && searchValue.length ? (
        <div role="status" className="flex justify-center w-full my-4">
          <svg
            aria-hidden="true"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-emerald-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : null}
      {suggestions.map((suggestion) => {
        return (
          <div
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion)}
            className="cursor-pointer"
          >
            {suggestion.place_name}
          </div>
        );
      })}
    </div>
  );
};

export default SearchBar;
