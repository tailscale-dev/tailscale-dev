import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSwr from 'swr';

export default function SearchPage({}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const findPosts = async () => {
    const res = await fetch(`/api/search?q=${searchTerm}`);
    return await res.json();
  };

  const { data } = useSwr(searchTerm, findPosts);

  useEffect(() => {
    if (searchTerm) {
      return;
    }

    switch (typeof router.query?.q) {
      case 'string':
        setSearchTerm(router.query.q);
        break;
      case 'object':
        setSearchTerm(router.query.q[0]);
        break;
    }
  }, [router.query.q, router, searchTerm]);

  return (
    <>
      <header className="bg-gray-900 py-20 text-center text-gray-100">
        <h1 className="text-4xl font-medium leading-tight tracking-tight">Search</h1>

        <div className="mt-6">
          <div className="flex justify-center md:justify-center">
            <div className="items-center justify-center leading-tight md:flex">
              <div className="relative max-w-lg">
                <label>
                  <span className="sr-only">Search posts</span>
                  <input
                    aria-label="Search posts"
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    defaultValue={searchTerm}
                    placeholder="Search title ..."
                    className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  />
                </label>
                <svg
                  className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container max-w-4xl">
        <ul>{data && data.posts && data?.posts.map((post) => <li key={post}>{post}</li>)}</ul>
      </main>
    </>
  );
}
