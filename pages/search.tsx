import React from 'react';
import { siteMetadata } from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayout';
import { PageSEO } from '@/components/SEO';
import { useRouter } from 'next/router';
import useSwr from 'swr';
import u from '@/lib/utils/url';
import type { SearchResults } from './api/search';
import { allBlogs, Blog } from 'contentlayer/generated';

const findPosts = (q: string) =>
  fetch(u('/api/search', { q })).then((res) => {
    return res.json();
  });

const getPost = (slug: string): Blog => {
  for (const post of allBlogs) {
    if (post.slug == slug) {
      return post;
    }
  }

  return undefined;
};

export default function SearchPage({}) {
  const router = useRouter();

  const { q }: { q: string } = router.query as { q: string };
  const { data, error, isLoading } = useSwr<SearchResults>(q ? q : null, findPosts);

  if (q === undefined) {
    return <h1>search box page here</h1>;
  }

  if (error) {
    return (
      <>
        <PageSEO title="oh noes" description={siteMetadata.description} />
        <h1>something bad happened</h1>
        <pre>
          <code>{error}</code>
        </pre>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <PageSEO title={`${q}: Search results`} description={siteMetadata.description} />
        <ListLayout
          posts={[]}
          initialDisplayPosts={undefined}
          searchText={q}
          pagination={undefined}
          title={`Loading...`}
        />
      </>
    );
  }

  if (!data) {
    return null;
  }

  if (data.message) {
    return (
      <>
        <PageSEO title="Can't find anything" description={siteMetadata.description} />
        <ListLayout
          posts={[]}
          searchText={q}
          initialDisplayPosts={undefined}
          pagination={undefined}
          title={`Results for ${q}`}
        />
      </>
    );
  }

  console.log(data);

  const posts = data.posts.map((slug) => getPost(slug));

  return (
    <>
      <PageSEO title={`${q}: Search results`} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        searchText={q}
        initialDisplayPosts={undefined}
        pagination={undefined}
        title={`Results for ${q}`}
      />
    </>
  );
}
