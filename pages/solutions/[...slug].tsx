import React from 'react';
import { MDXLayoutRenderer } from '@/components/mdx';
import { MDXComponents } from '@/components/mdx-components';
import { coreContent, sortedBlogPost, getSideNavData } from '@/lib/utils/contentlayer';
import { InferGetStaticPropsType } from 'next';
import { allAuthors, allSolutions } from 'contentlayer/generated';
import type { Solution } from 'contentlayer/generated';

const DEFAULT_LAYOUT = 'post-layout';

export async function getStaticPaths() {
  return {
    paths: allSolutions.map((p) => ({ params: { slug: p.slug.split('/') } })),
    fallback: false,
  };
}

export const getStaticProps = async ({ params }) => {
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

  return {
    props: {
      post,
      authorDetails,
      prev,
      next,
      sideNavData: getSideNavData(allSolutions),
    },
  };
};

export default function SolutionPage({
  post,
  authorDetails,
  prev,
  next,
  sideNavData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <MDXLayoutRenderer
      layout={post.layout || DEFAULT_LAYOUT}
      content={post}
      MDXComponents={MDXComponents}
      toc={post.toc}
      authorDetails={authorDetails}
      prev={prev}
      next={next}
      sideNavData={sideNavData}
    />
  );
}
