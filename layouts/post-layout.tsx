import React, { MouseEventHandler, ReactNode } from 'react';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import type { Authors, Blog } from 'contentlayer/generated';
import { CoreContent } from '@/lib/utils/contentlayer';
import { BlogSEO } from '@/components/seo';
import Image from '@/components/image';
import Tag from '@/components/tag';
import { siteMetadata } from '@/data/site-metadata';
import ScrollTop from '@/components/scroll-top';
import ExternalLink from '@/components/external-link';
import { DateDisplay } from '@/components/date-display';

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/master/data/${path}`;

interface LayoutProps {
  content: CoreContent<Blog>;
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

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, date, title, tags, url } = content;
  const basePath = path.split('/')[0];

  return (
    <>
      <BlogSEO url={`${siteMetadata.siteUrl}/${path}`} authorDetails={authorDetails} {...content} />
      <ScrollTop />
      <main className="container grid grid-cols-3 py-12 md:gap-16">
        <div className="col-span-3 divide-y lg:col-span-2">
          <header className="py-10 text-center">
            <h1 className="text-4xl font-medium leading-tight tracking-tight">{title}</h1>

            <div className="mt-6">
              <div className="flex justify-center md:justify-center">
                <div className="items-center justify-center leading-tight md:flex">
                  <div className="md:text-leftleading-snug order-2 md:ml-2">
                    <ul className="sentanceCase inline-block">
                      {authorDetails.map((author) => (
                        <li key={author.path} className="inline-block pl-1">
                          <a
                            className="whitespace-nowrap text-blue-700 transition-colors hover:text-blue-300"
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
                                className="whitespace-nowrap text-blue-700 transition-colors hover:text-blue-300"
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
                            <span className="mx-1 rounded-md bg-[#496495] text-white p-1 text-sm font-medium">
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
          <article className="pt-6 Markdown BlogMarkdown">
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
