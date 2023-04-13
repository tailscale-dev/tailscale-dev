import React from 'react';
import Link from 'next/link';
import { PageSEO } from '@/components/seo';
import { siteMetadata } from '@/data/site-metadata';
import { sortedBlogPost, allCoreContent, sortedFutureEventPosts } from '@/lib/utils/contentlayer';
import { InferGetStaticPropsType } from 'next';
import { allBlogs, allEvents } from 'contentlayer/generated';
import type { Blog, Events } from 'contentlayer/generated';
import { ListItem } from '@/components/list-item';

const MAX_EVENTS_DISPLAY = 3;
const MAX_POSTS_DISPLAY = 5;

export const getStaticProps = async () => {
  const sortedPosts = sortedBlogPost(allBlogs) as Blog[];
  const sortedEvents = sortedFutureEventPosts(allEvents) as Events[];
  const posts = allCoreContent(sortedPosts);
  const events = allCoreContent(sortedEvents);

  return { props: { posts, events } };
};

export default function Home({ posts, events }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <header className="bg-gray-900 py-20 text-center text-gray-100">
        <h1 className="mb-4 text-4xl font-medium tracking-tight">
          Tailscale + Your machines = Access from anywhere
        </h1>
        <p className="mx-auto mb-6 max-w-3xl leading-6 sm:mb-8 sm:text-lg md:mb-10 md:text-xl">
          Your laptop can be in Toronto, staging can be in Sunnyvale, production can be in{' '}
          <code>us-east-1</code>, and all of that can be accessed from anywhere with an internet
          connection. Free yourself from the slings and arrows of port forwarding and the fleeting
          hope that you don&apos;t get hacked and just focus on what you do best.
        </p>
      </header>
      <main className="container md:flex md:max-w-5xl md:flex-row md:gap-20">
        <div className="md:basis-2/3">
          <div>
            <h2 className="pt-6 pb-4 text-3xl font-bold leading-8 tracking-tight">Latest Posts</h2>
            <ul>
              {!posts.length && 'No posts found.'}
              {posts.slice(0, MAX_POSTS_DISPLAY).map((post) => (
                <ListItem
                  key={post.slug}
                  title={post.title}
                  slug={post.slug}
                  path={post.path}
                  tags={post.tags}
                  summary={post.summary}
                  date={post.date}
                />
              ))}
            </ul>
          </div>
          <div className="flex justify-end text-base font-medium leading-6">
            <Link
              href="/blog"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="all posts"
            >
              All Posts &rarr;
            </Link>
          </div>
        </div>
        <div className="md:basis-1/3">
          <div>
            <h2 className="pt-6 pb-4 text-3xl font-bold leading-8 tracking-tight">
              Upcoming Events
            </h2>
            <ul>
              {!events.length && 'No events found.'}
              {events.slice(0, MAX_EVENTS_DISPLAY).map((event) => (
                <ListItem
                  key={event.slug}
                  title={event.title}
                  slug={event.slug}
                  path={event.path}
                  location={event.location}
                  summary={event.summary}
                  date={event.displayDate}
                />
              ))}
            </ul>
          </div>
          {events.length > MAX_EVENTS_DISPLAY && (
            <div className="flex justify-end text-base font-medium leading-6">
              <Link
                href="/events"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="all events"
              >
                All Events &rarr;
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
