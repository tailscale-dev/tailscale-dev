import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { siteMetadata } from '@/data/site-metadata';

export default function SearchPage({}) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!searchTerm && router.query?.q) {
      switch (typeof router.query?.q) {
        case 'string':
          setSearchTerm(router.query.q);
          break;
        case 'object':
          setSearchTerm(router.query.q[0]);
          break;
      }
    }

    const config = {
      endpointBase: 'https://tailscale-search.ent.us-east-1.aws.found.io',
      engineName: 'tailscale-search-engine',
    };

    if (!searchTerm) return;

    const search = async () => {
      const res = await fetch(
        `${config.endpointBase}/api/as/v1/engines/${config.engineName}/search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SEARCH_API_KEY}`,
          },

          body: JSON.stringify({
            query: searchTerm,
            page: {
              size: 10,
              current: 1,
            },
            facets: {
              type: {
                type: 'value',
                size: 10,
              },
            },
            boosts: {
              title: {
                type: 'value',
                value: searchTerm,
                operation: 'multiply',
                factor: 2,
              },
              meta_description: {
                type: 'value',
                value: searchTerm,
                operation: 'multiply',
                factor: 2,
              },
              body_content: {
                type: 'value',
                value: searchTerm,
                operation: 'multiply',
                factor: 2,
              },
            },
            result_fields: {
              id: {
                raw: {},
              },
              url: {
                raw: {},
              },
              title: {
                snippet: {
                  size: 200,
                  fallback: true,
                },
              },
              meta_description: {
                snippet: {
                  size: 200,
                  fallback: true,
                },
              },
              body_content: {
                snippet: {
                  size: 200,
                  fallback: true,
                },
              },
            },
          }),
        }
      );
      return res;
    };

    search()
      .then((res) => res.json())
      .then((data) => setResults(data.results));
  }, [searchTerm, router.query.q]);

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
        <ul className="search-results">
          {results?.map((r) => (
            <li key={r.id.raw} className="mb-1">
              <div className="ArticlePreview group relative flex rounded-md px-2 py-2 transition-all hover:bg-blue-100 dark:hover:bg-gray-800">
                <svg
                  className="icon relative -top-px mr-2 inline-block stroke-blue-500 group-hover:stroke-blue-700"
                  style={{ flex: '0 0 1.35rem' }}
                >
                  {!r.url.raw.startsWith(siteMetadata.siteUrl) && (
                    <use href="/images/icons.svg#external-link"></use>
                  )}
                </svg>
                <div key={r.id.raw}>
                  <h4 className="font-medium">
                    <a
                      className="link"
                      href={`${r.url.raw}?q=${searchTerm}`}
                      dangerouslySetInnerHTML={{ __html: r.title.snippet }}
                    />
                  </h4>
                  <p
                    className="text-gray-900  dark:text-gray-100"
                    dangerouslySetInnerHTML={{ __html: r.meta_description.snippet }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
