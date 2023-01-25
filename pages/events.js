import React from 'react';
import { events } from '../data/events';
import { PageSEO } from '../components/SEO';
import { siteMetadata } from '@/data/siteMetadata';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/formatDate';

export default function Events({ posts }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
            Upcoming Events
          </h1>
        </div>
        <ul>
          {!posts.length && 'No events found.'}
          {posts.map((post, i) => {
            const { date, title, summary, link } = post;
            return (
              <li key={i} className="py-6">
                <article>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link href={link} className="text-gray-900 dark:text-gray-100">
                          {title}
                        </Link>
                      </h2>

                      <div className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <span className="pr-4">&frasl;&frasl;</span>
                        <time dateTime={date}>{formatDate(date)}</time>
                      </div>
                    </div>
                    <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                      {summary}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      posts: events,
    },
  };
}
