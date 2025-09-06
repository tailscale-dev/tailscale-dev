import React, { ReactNode } from 'react';
import Link from 'next/link';
import type { Authors, Blog, Solution } from 'contentlayer/generated';
import { CoreContent } from '@/lib/utils/contentlayer';
import { BlogSEO } from '@/components/seo';
import Tag from '@/components/tag';
import { siteMetadata } from '@/data/site-metadata';
import ScrollTop from '@/components/scroll-top';
import ExternalLink from '@/components/external-link';
import SearchBar from '@/components/search-bar';
import { RelatedArticle } from '@/lib/utils/elasticsearch';

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/master/data/${path}`;

interface LayoutProps {
  content: CoreContent<Solution>;
  authorDetails: CoreContent<Authors>[];
  next?: { path: string; title: string };
  prev?: { path: string; title: string };
  children: ReactNode;
  relatedArticles: RelatedArticle[];
}

interface TOC {
  value: string;
  url: string;
  depth: number;
}

export default function SolutionLayout({
  content,
  authorDetails,
  children,
  relatedArticles,
}: LayoutProps) {
  const { filePath, path, title, tags } = content;
  const basePath = path.split('/')[0];
  const blogContent = content as unknown as CoreContent<Blog>;

  const toc = content.toc as unknown as TOC[];

  return (
    <>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/${path}`}
        authorDetails={authorDetails}
        {...blogContent}
      />
      <ScrollTop />
      <main className="container grid grid-cols-3 mt-8 md:gap-16">
        <div className="col-span-3 lg:col-span-2 items-center">
          <div className="lg:ml-36 mb-4 max-w-xs">
            <SearchBar />
          </div>
          <article className="Markdown BlogMarkdown mt-2">
            <h1 className="text-4xl font-medium leading-tight tracking-tight">{title}</h1>
            {children}
          </article>
        </div>
        <div className="sticky top-0 hidden self-start lg:block">
          <div className="row-start-2 text-sm font-medium leading-5 dark:divide-gray-700">
            {tags && (
              <>
                <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Tags
                </h2>
                <div className="flex flex-wrap">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="pt-8">
            <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Table of Contents
            </h2>
            <ul className="pt-1">
              {toc
                .filter((heading) => heading.depth <= 3)
                .map((heading) => (
                  <li key={heading.url}>
                    <a
                      href={heading.url}
                      className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      {heading.value}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div className="pt-8">
            <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Related Pages
            </h2>
            <ul className="pt-1">
              {relatedArticles.map((page) => (
                <li key={page.url_path}>
                  <a href={page.url_path}>{page.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <Link
              href={`/${basePath}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="Discover more things you can do with Tailscale"
            >
              &larr; Discover more things you can do with Tailscale
            </Link>
          </div>

          <div className="pt-6 pb-6">
            <ExternalLink href={editUrl(filePath)}>Improve this page</ExternalLink>
          </div>
        </div>
      </main>
    </>
  );
}
