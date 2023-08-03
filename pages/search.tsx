import Image from '@/components/image';
import Link from 'next/link';
import { PageSEO } from '@/components/seo';
import { useEffect, useState } from 'react';
import { SearchResponse, SearchResult } from './api/search';
import NoSSRWrapper from '@/components/no-ssr-wrapper';
import Tag from '@/components/tag';
import { DateDisplay } from '@/components/date-display';

const SearchHit = (item: SearchResult) => {
  const names = item.authors.map((author) => author.name).join(' and ');
  return (
    <div className="mx-auto my-4 max-w-lg flex space-x-4 rounded-md border border-solid border-gray-200 bg-gray-100 p-3 dark:border-gray-700  dark:bg-gray-800">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center self-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
        {item.authors.map((author) => (
          <Image
            key={author.slug}
            src={author.avatar}
            width={64}
            height={64}
            alt={`the avatar for ${author.name}`}
          />
        ))}
      </div>
      <div className="conversation-chat min-w-0 self-center">
        <Link
          className="text-blue-600 dark:text-blue-300 text-xl font-bold leading-8 tracking-tight hover:underline hover:text-blue-500 dark:hover:text-blue-400 dark:hover:text-blue-500 dark:hover:underline dark:hover:bg-gray-700 dark:hover:bg-opacity-10 rounded-"
          href={item.permalink}
        >
          {item.title}
        </Link>
        <br />
        <span>
          by {names} on <DateDisplay dateString={item.date} />
        </span>
        <br />
        <span className="uppercase font-mono">
          {item.tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </span>
        <br />
        <span>{item.summary}</span>
        <br />
        <blockquote className="mt-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 p-3 boder border-solid rounded-md border-gray-300 dark:border-gray-600">
          <span dangerouslySetInnerHTML={{ __html: item.description }}></span>
        </blockquote>
      </div>
    </div>
  );
};

const setBrowserQuery = (query: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set('q', query);
  window.history.replaceState({}, '', url.toString());
};

const getBrowserQuery = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  const url = new URL(window.location.href);
  return url.searchParams.get('q') || '';
};

export const Spinner = () => (
  <>
    <div className="flex my-4 items-center justify-center w-full h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
    </div>
  </>
);

export default function Search() {
  const [searchTerm, setSearchTerm] = useState(getBrowserQuery());
  const [searchResults, setSearchResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const debounceMS = 150;

  useEffect(() => {
    const fetchData = setTimeout(async () => {
      try {
        setErrorMsg('');
        setLoading(true);

        const res = await fetch('/api/search?q=' + encodeURIComponent(searchTerm));
        const json: SearchResponse = await res.json();

        setBrowserQuery(searchTerm);

        if (json.status !== 'ok') {
          setErrorMsg(json.error);
        }

        setSearchResults(json.data);
        setLoading(false);
      } catch (error) {
        setErrorMsg(error.message);
      }
    }, debounceMS);

    return () => clearTimeout(fetchData);
  }, [searchTerm]);

  return (
    <>
      <PageSEO title="Search" description="Find anything you want to know about Tailscale" />
      <header className="bg-gray-900 py-20 text-center text-gray-100">
        <h1 className="mb-4 text-4xl font-medium tracking-tight">Search</h1>
      </header>
      <noscript>Sorry, this needs JavaScript enabled to work!</noscript>
      <NoSSRWrapper>
        <div className="max-w-2xl mx-auto">
          <div className="space-x-2 pt-6 pb-8 md:space-y-5">
            <input
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
              type="text"
              value={searchTerm}
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">{errorMsg}</p>
          {loading && (
            <>
              <Spinner />
            </>
          )}
          <p>
            {searchTerm === '' && <span>Enter some terms to search!</span>}
            {searchResults && searchResults.length === 0 && searchTerm !== '' && !loading && (
              <span>No results found for {searchTerm}</span>
            )}
            <ul>{searchResults && searchResults.map((item) => <>{SearchHit(item)}</>)}</ul>
          </p>
        </div>
      </NoSSRWrapper>
    </>
  );
}
