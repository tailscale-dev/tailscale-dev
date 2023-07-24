import React from 'react';

export default function SearchBar() {
  const [query, setQuery] = React.useState('');

  return (
    <>
      <div className="relative flex flex-wrap items-stretch">
        <input
          type="search"
          className="relative m-0 block max-w-fit min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="button-addon2"
          onInput={(e) => setQuery(e.currentTarget.value)}
          onSubmit={() => {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
          }}
          onKeyDown={(e) => {
            if (document.activeElement == e.target && e.key === 'Enter') {
              window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }
          }}
          value={query}
        />

        <span
          className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
          id="basic-addon2"
          onClick={() => {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </>
  );
}
