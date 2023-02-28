import React, { ReactNode } from 'react';
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

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, date, title, tags } = content;
  const basePath = path.split('/')[0];

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
                        {author.name}
                      </a>
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

          <div className="pt-6 pb-6">
            <ExternalLink href={editUrl(filePath)}>Improve this page</ExternalLink>
          </div>
        </div>
      </main>
    </>
  );
}
