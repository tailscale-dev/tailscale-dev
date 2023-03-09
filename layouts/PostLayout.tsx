import React, { MouseEventHandler, ReactNode } from 'react';
import { CoreContent } from '@/lib/utils/contentlayer';
import type { Blog, Authors } from 'contentlayer/generated';
import Link from 'next/link';
import { BlogSEO } from '@/components/SEO';
import Image from '@/components/Image';
import Tag from '@/components/Tag';
import { siteMetadata } from '@/data/siteMetadata';
import ScrollTop from '@/components/ScrollTop';
import ExternalLink from '@/components/ExternalLink';
import { DateDisplay } from '@/components/DateDisplay';

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/master/data/${path}`;

interface LayoutProps {
  content: CoreContent<Blog>;
  authorDetails: CoreContent<Authors>[];
  next?: { path: string; title: string };
  prev?: { path: string; title: string };
  children: ReactNode;
}

const u = (url = '', params: Record<string, string> = {}) => {
  let result = new URL(url, 'https://tailscale.dev');
  Object.entries(params).forEach((kv) => {
    let [k, v] = kv;
    result.searchParams.set(k, v);
  });
  return result.toString();
};

const ShareLinkButton = ({
  children,
  href,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}) => {
  return (
    <div className="mx-1 shrink-0">
      <a
        href={href}
        className="w-42 mt-2 flex rounded bg-blue-500 px-6 py-3 text-gray-200 no-underline hover:cursor-pointer hover:bg-blue-600 hover:text-gray-100 hover:underline"
        onClick={onClick}
      >
        {children}
      </a>
    </div>
  );
};

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, date, title, tags } = content;
  const basePath = path.split('/')[0];
  const guessForPageURL = `https://tailscale.dev/blog/${content.slug}`; // xxx needs fix once solutions lands

  return (
    <>
      <BlogSEO url={`${siteMetadata.siteUrl}/${path}`} authorDetails={authorDetails} {...content} />
      <ScrollTop />
      <header className="bg-gray-900 py-20 text-center text-gray-100">
        <h1 className="text-4xl font-medium leading-tight tracking-tight">{title}</h1>

        <div className="mt-6">
          <div className="flex justify-center md:justify-center">
            <div className="items-center justify-center leading-tight md:flex">
              <div className="md:text-leftleading-snug order-2 md:ml-2">
                <ul className="sentanceCase inline-block">
                  {authorDetails.map((author) => (
                    <li key={author.path} className="inline-block pl-1">
                      <a
                        className="whitespace-nowrap text-blue-300 transition-colors hover:text-blue-700"
                        href={author.website}
                        rel="noreferer noopener noreferrer"
                        target="_blank"
                      >
                        {author.name}{' '}
                      </a>
                      {author.pronouns != undefined && (
                        <>
                          (
                          <a
                            className="whitespace-nowrap text-blue-300 transition-colors hover:text-blue-700"
                            href={author.pronouns.link}
                            rel="noreferer noopener noreferrer"
                            target="_blank"
                          >
                            {author.pronouns.display}
                          </a>
                          )
                        </>
                      )}
                      {author.tailscalar && (
                        <span className="mx-1 rounded-md bg-[#496495] p-1 text-sm font-medium">
                          Tailscalar
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <span className="px-1">on</span>
                <DateDisplay dateString={date} />
              </div>

              <div className="mt-3 flex justify-center md:mt-0 md:justify-center">
                {authorDetails.map((author) => (
                  <div
                    key={author.path}
                    className="block h-8 max-h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 bg-cover bg-center bg-no-repeat"
                  >
                    <Image
                      src={author.avatar}
                      width={32}
                      height={32}
                      alt={`Photo of ${author.name}`}
                      className="rounded-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container grid grid-cols-3 py-12 md:gap-16">
        <div className="col-span-3 divide-y lg:col-span-2">
          <article className="Markdown BlogMarkdown">
            {tags.includes('community-made') && (
              <div className="note">
                This article is contributed by a member of the Tailscale community, not a Tailscale
                employee. If you have an interesting story to share about how you use Tailscale,
                reach out to <a href="mailto:devrel@tailscale.com">devrel@tailscale.com</a>.
              </div>
            )}

            {children}

            {tags.includes('community-made') && (
              <div className="note">
                As always, make sure to review any code before running it on your computer.
              </div>
            )}
          </article>
        </div>
        <div className="sticky top-0 hidden self-start lg:block">
          <div className="row-start-2 divide-y divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700">
            {tags && (
              <div className="pb-8">
                <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Tags
                </h2>
                <div className="flex flex-wrap">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              </div>
            )}
            {(next || prev) && (
              <div className="justify-between space-y-8 py-8">
                {prev && (
                  <div>
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Previous Article
                    </h2>
                    <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                      <Link href={`/${prev.path}`}>{prev.title}</Link>
                    </div>
                  </div>
                )}
                {next && (
                  <div>
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Next Article
                    </h2>
                    <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                      <Link href={`/${next.path}`}>{next.title}</Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="pt-8">
            <Link
              href={`/${basePath}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="Back to the blog"
            >
              &larr; Back to the blog
            </Link>
          </div>

          <div className="flex flex-wrap items-start break-all pt-8">
            <ShareLinkButton href="/feed.xml" onClick={() => {}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-rss mr-2 shrink-0"
              >
                <path d="M4 11a9 9 0 0 1 9 9"></path>
                <path d="M4 4a16 16 0 0 1 16 16"></path>
                <circle cx="5" cy="19" r="1"></circle>
              </svg>{' '}
              RSS
            </ShareLinkButton>
            <ShareLinkButton
              onClick={() => {
                const data = {
                  title: content.title,
                  text: content.summary,
                  url: guessForPageURL,
                };
                console.log(data);
                if (navigator.share) {
                  navigator.share(data);
                } else {
                  alert("page isn't on HTTPS or you don't have navigator.share");
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-share mr-2 shrink-0"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>{' '}
              Share
            </ShareLinkButton>
            <ShareLinkButton
              href={u('https://twitter.com/intent/tweet', {
                via: 'tailscale',
                text: `${content.title}`,
                url: guessForPageURL,
              })}
              onClick={() => {}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-twitter mr-2 shrink-0"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>{' '}
              Tweet
            </ShareLinkButton>
            <ShareLinkButton
              href={u('https://www.linkedin.com/shareArticle', {
                url: guessForPageURL,
                title: content.title,
              })}
              onClick={() => {}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-linkedin mr-2 shrink-0"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>{' '}
              LinkedIn
            </ShareLinkButton>
            <ShareLinkButton
              href={u('https://hachyderm.io/share', {
                text: `${content.title}\n\n${guessForPageURL} - by ${
                  authorDetails[0].fediverse ? authorDetails[0].fediverse : '@tailscale'
                }`,
                visibility: 'public',
              })}
              onClick={() => {}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="feather feather-mastodon mr-2 shrink-0"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width={2}
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18.648 15.254c-1.816 1.763 -6.648 1.626 -6.648 1.626a18.262 18.262 0 0 1 -3.288 -.256c1.127 1.985 4.12 2.81 8.982 2.475c-1.945 2.013 -13.598 5.257 -13.668 -7.636l-.026 -1.154c0 -3.036 .023 -4.115 1.352 -5.633c1.671 -1.91 6.648 -1.666 6.648 -1.666s4.977 -.243 6.648 1.667c1.329 1.518 1.352 2.597 1.352 5.633s-.456 4.074 -1.352 4.944z" />
                <path d="M12 11.204v-2.926c0 -1.258 -.895 -2.278 -2 -2.278s-2 1.02 -2 2.278v4.722m4 -4.722c0 -1.258 .895 -2.278 2 -2.278s2 1.02 2 2.278v4.722" />
              </svg>{' '}
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
