import React from 'react';
import { MDXLayoutRenderer } from '@/components/mdx';
import { MDXComponents } from '@/components/mdx-components';
import { coreContent, sortedBlogPost } from '@/lib/utils/contentlayer';
import { InferGetServerSidePropsType } from 'next';
import { allAuthors, allSolutions } from 'contentlayer/generated';
import type { Solution } from 'contentlayer/generated';
import { relatedArticles } from '@/lib/utils/elasticsearch';

const DEFAULT_LAYOUT = 'solution-layout';

export const getServerSideProps = async ({ params }) => {
  const slug = (params.slug as string[]).join('/');
  const sortedPosts = sortedBlogPost(allSolutions) as Solution[];
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug);
  const prevContent = sortedPosts[postIndex + 1] || null;
  const prev = prevContent ? coreContent(prevContent) : null;
  const nextContent = sortedPosts[postIndex - 1] || null;
  const next = nextContent ? coreContent(nextContent) : null;
  const post = sortedPosts.find((p) => p.slug === slug);
  const authorList = post.authors || ['default'];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults);
  });

  const related = await relatedArticles({
    summary: post.summary,
    tags: post.tags,
    title: post.title,
  });

  return {
    props: {
      post,
      authorDetails,
      prev,
      next,
      relatedArticles: related,
    },
  };
};

export default function SolutionPage({
  post,
  authorDetails,
  prev,
  next,
  relatedArticles,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MDXLayoutRenderer
      layout={post.layout || DEFAULT_LAYOUT}
      content={post}
      MDXComponents={MDXComponents}
      toc={post.toc}
      authorDetails={authorDetails}
      prev={prev}
      next={next}
      relatedArticles={relatedArticles}
    />
  );
}
