import React from 'react';
import { siteMetadata } from '@/data/site-metadata';
import ListLayout from '@/layouts/list-layout';
import { PageSEO } from '@/components/seo';
import { sortedBlogPost, allCoreContent } from '@/lib/utils/contentlayer';
import { InferGetStaticPropsType } from 'next';
import { allBlogs } from 'contentlayer/generated';
import type { Blog } from 'contentlayer/generated';

export const POSTS_PER_PAGE = 10;

export const getStaticProps = async () => {
  const posts = sortedBlogPost(allBlogs) as Blog[];
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

export default function BlogPage({
  posts,
  initialDisplayPosts,
  pagination,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title="Blog" description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  );
}
