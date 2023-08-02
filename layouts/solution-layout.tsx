import React, { MouseEventHandler, ReactNode } from 'react';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import type { Authors, Blog, Solution } from 'contentlayer/generated';
import { CoreContent } from '@/lib/utils/contentlayer';
import { BlogSEO } from '@/components/seo';
import Tag from '@/components/tag';
import { siteMetadata } from '@/data/site-metadata';
import ScrollTop from '@/components/scroll-top';
import ExternalLink from '@/components/external-link';
import Breadcrumbs from '@/components/breadcrumbs';

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/master/data/${path}`;

interface LayoutProps {
  content: CoreContent<Solution>;
  authorDetails: CoreContent<Authors>[];
  next?: { path: string; title: string };
  prev?: { path: string; title: string };
  children: ReactNode;
}

interface ShareLinkButtonProps {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  iconName: string;
  href?: LinkProps['href'];
  children: ReactNode;
}

const ShareLinkButton = ({ children, iconName, href = '#', onClick }: ShareLinkButtonProps) => {
  let icon = (
    <svg className="icon mr-2" style={{ flex: '0 0 1.35rem' }}>
      <use href={`/images/icons.svg#${iconName}`}></use>
    </svg>
  );

  if (iconName === 'hachyderm') {
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18.648 15.254c-1.816 1.763 -6.648 1.626 -6.648 1.626a18.262 18.262 0 0 1 -3.288 -.256c1.127 1.985 4.12 2.81 8.982 2.475c-1.945 2.013 -13.598 5.257 -13.668 -7.636l-.026 -1.154c0 -3.036 .023 -4.115 1.352 -5.633c1.671 -1.91 6.648 -1.666 6.648 -1.666s4.977 -.243 6.648 1.667c1.329 1.518 1.352 2.597 1.352 5.633s-.456 4.074 -1.352 4.944z" />
        <path d="M12 11.204v-2.926c0 -1.258 -.895 -2.278 -2 -2.278s-2 1.02 -2 2.278v4.722m4 -4.722c0 -1.258 .895 -2.278 2 -2.278s2 1.02 2 2.278v4.722" />
      </svg>
    );
  }

  return (
    <>
      <div className="mx-1 shrink-0">
        <Link
          href={href}
          className="w-42 mt-2 flex rounded bg-blue-500 p-2 text-gray-200 no-underline hover:cursor-pointer hover:bg-blue-600 hover:text-gray-100 hover:underline dark:bg-blue-800"
          onClick={onClick}
        >
          {icon}
          {children}
        </Link>
      </div>
    </>
  );
};

interface TOC {
  value: string;
  url: string;
  depth: number;
}

export default function PostLayout({ content, authorDetails, children }: LayoutProps) {
  const { filePath, path, title, tags, url } = content;
  const basePath = path.split('/')[0];
  const blogContent = content as unknown as CoreContent<Blog>;

  const toc = content.toc as unknown as TOC[];
  console.log(toc);

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
          <div className="mx-auto mb-4 px-7 self-center">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                className="block flex-1 border-0 bg-transparent w-sm py-1.5 pl-1 text-gray-900 placeholder:text-gray-700 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Search bar placeholder"
              />
            </div>
          </div>
          <Breadcrumbs
            includeThisPage={false}
            titleMap={{ [basePath]: 'Solutions', [content.slug]: '' }}
          />

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
              <li>placeholder</li>
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

          <div className="flex flex-wrap items-start break-all pt-8">
            <ShareLinkButton href="/feed.xml" iconName="rss" onClick={() => {}}>
              RSS
            </ShareLinkButton>
            <ShareLinkButton
              iconName="share"
              onClick={() => {
                const data = {
                  title: content.title,
                  text: content.summary,
                  url,
                };
                if (navigator.share) {
                  navigator.share(data);
                } else {
                  alert(
                    'Only available in browsers that support the Navigator.share() method of the Web Share API.'
                  );
                }
              }}
            >
              Share
            </ShareLinkButton>
            <ShareLinkButton
              iconName="twitter"
              href={{
                protocol: 'https',
                hostname: 'twitter.com',
                pathname: 'intent/tweet',
                query: { via: 'tailscale', text: `${content.title}`, url },
              }}
            >
              Tweet
            </ShareLinkButton>
            <ShareLinkButton
              iconName="linkedin"
              href={{
                protocol: 'https',
                hostname: 'www.linkedin.com',
                pathname: 'shareArticle',
                query: { url, title: content.title },
              }}
            >
              LinkedIn
            </ShareLinkButton>
            <ShareLinkButton
              iconName="hachyderm"
              href={{
                protocol: 'https',
                hostname: 'hachyderm.io',
                pathname: 'share',
                query: {
                  text: `${content.title}\n\n${url} - by ${
                    authorDetails[0].fediverse ? authorDetails[0].fediverse : '@tailscale'
                  }`,
                  visibility: 'public',
                },
              }}
            >
              Hachyderm
            </ShareLinkButton>
          </div>

          <div className="pt-6 pb-6">
            <ExternalLink href={editUrl(filePath)}>Improve this page</ExternalLink>
          </div>
        </div>
      </main>
    </>
  );
}
