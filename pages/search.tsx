import Image from '@/components/image';
import Link from 'next/link';
import { PageSEO } from '@/components/seo';
import { useEffect, useState } from 'react';
import { SearchResponse, SearchResult } from './api/search';
import NoSSRWrapper from '@/components/no-ssr-wrapper';

const SearchResult = (item: SearchResult) => {
  const names = item.authors.map((author) => author.name).join(' and ');
  return (
    <div className="my-4 flex space-x-4 rounded-md border border-solid border-gray-200 bg-gray-100 p-3 dark:border-gray-700  dark:bg-gray-800">
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
        <Link className="text-blue-600 dark:text-blue-300" href={item.permalink}>
          {item.title}
        </Link>
        <br />
        <span className="text-gray-500 dark:text-gray-400">
          by {names} on {item.date}
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

export default function Search() {
  const [searchTerm, setSearchTerm] = useState(getBrowserQuery());
  const [searchResults, setSearchResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const debounceMS = 150;

  useEffect(() => {
    const fetchData = setTimeout(async () => {
      try {
        setErrorMsg('');

        const res = await fetch('/api/search?q=' + encodeURIComponent(searchTerm));
        const json: SearchResponse = await res.json();

        setBrowserQuery(searchTerm);

        if (json.status !== 'ok') {
          setErrorMsg(json.error);
        }

        setSearchResults(json.data);
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
      <NoSSRWrapper>
        <div className="max-w-lg mx-auto">
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
          <p>
            {searchTerm === '' && <span>Enter some terms to search!</span>}
            {searchResults.length === 0 && searchTerm !== '' && (
              <span>No results found for {searchTerm}</span>
            )}
            <ul>{searchResults.map((item) => SearchResult(item))}</ul>
          </p>
        </div>
      </NoSSRWrapper>
    </>
  );
}
