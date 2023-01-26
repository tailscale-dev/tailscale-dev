import React from 'react';
import Link from 'next/link';
import { PageSEO } from '@/components/SEO';
import Card from '@/components/Card';
import { siteMetadata } from '@/data/siteMetadata';
import { formatDate } from '@/lib/utils/formatDate';
import { sortedBlogPost, allCoreContent } from '@/lib/utils/contentlayer';
import { InferGetStaticPropsType } from 'next';
import { allBlogs } from 'contentlayer/generated';
import type { Blog } from 'contentlayer/generated';
import { ListItem } from '@/components/ListItem';

const MAX_DISPLAY = 5;

export const getStaticProps = async () => {
  const sortedPosts = sortedBlogPost(allBlogs) as Blog[];
  const posts = allCoreContent(sortedPosts);

  return { props: { posts } };
};

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
            Latest
          </h1>
        </div>
        <ul>
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => (
            <ListItem
              key={post.slug}
              title={post.title}
              slug={post.slug}
              path={post.path}
              tags={post.tags}
              summary={post.summary}
              date={formatDate(post.date)}
            />
          ))}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      <div className="container py-12">
        <div className="-m-4 flex flex-wrap">
          <Card
            title="Tailscale SSH"
            description="No need to generate, distribute, and manage SSH keys. Rely on Tailscale to manage access."
            imgSrc=""
            href=""
          />
          <Card
            title="tsnet"
            description="Make your internal services easier to run, access, and secure by transforming them into virtual private services on your tailnet"
            imgSrc=""
            href=""
          />
        </div>
      </div>
    </>
  );
}
