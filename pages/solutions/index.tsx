import React from 'react';
import { siteMetadata } from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayout';
import { PageSEO } from '@/components/SEO';
import { sortedBlogPost, allCoreContent } from '@/lib/utils/contentlayer';
import { InferGetStaticPropsType } from 'next';
import { allSolutions, Solution } from 'contentlayer/generated';

export const POSTS_PER_PAGE = 10;

export const getStaticProps = async () => {
  const posts = sortedBlogPost(allSolutions) as Solution[];
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE);
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return {
    props: {
      initialDisplayPosts: allCoreContent(initialDisplayPosts),
      posts: allCoreContent(posts),
      pagination,
    },
  };
};

export default function SolutionsPage({
  posts,
  initialDisplayPosts,
  pagination,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title="Solutions" description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Solutions"
      />
    </>
  );
}
