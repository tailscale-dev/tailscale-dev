import { ReactNode } from 'react';
import { CoreContent } from '@/lib/utils/contentlayer';
import type { Events, Authors } from 'contentlayer/generated';
import Link from 'next/link';
import { PageSEO } from '@/components/seo';
import { siteMetadata } from '@/data/site-metadata';
import ScrollTop from '@/components/scroll-top';
import ExternalLink from '@/components/external-link';
import { DateDisplay } from '@/components/date-display';

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/master/data/${path}`;

interface LayoutProps {
  content: CoreContent<Events>;
  authorDetails: CoreContent<Authors>[];
  next?: { path: string; title: string };
  prev?: { path: string; title: string };
  children: ReactNode;
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { filePath, path, title } = content;
  const basePath = path.split('/')[0];

  return (
    <>
      <PageSEO title={title} description={content.summary} {...content} />
      <ScrollTop />
      <header className="bg-gray-900 py-20 text-center text-gray-100">
        <h1 className="text-4xl font-medium leading-tight tracking-tight">{title}</h1>

        <div className="mt-6">
          <DateDisplay dateString={content.displayDate} />
        </div>
      </header>
      <main className="container grid grid-cols-3 py-12 md:gap-16">
        <div className="col-span-3 divide-y lg:col-span-2">
          <article className="Markdown BlogMarkdown">
            <dl>
              <div className="grid grid-cols-4 gap-4 px-4 py-5">
                <dt>Location</dt>
                <dd className="col-span-3">{content.location}</dd>
              </div>

              {content.displayTime && (
                <div className="grid grid-cols-4 gap-4 px-4 py-5">
                  <dt>Time</dt>
                  <dd className="col-span-3">{content.displayTime}</dd>
                </div>
              )}

              <div className="grid grid-cols-4 gap-4 px-4 py-5">
                <dt>Additional Details</dt>
                <dd className="col-span-3">
                  <Link href={content.link}>{content.link}</Link>
                </dd>
              </div>
            </dl>
            {children}
          </article>
        </div>
        <div className="sticky top-0 hidden self-start lg:block">
          <div className="divide-y divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700">
            {(next || prev) && (
              <div className="pb-8">
                {prev && (
                  <div className="pb-6">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Previous Event
                    </h2>
                    <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                      <Link href={`/${prev.path}`}>{prev.title}</Link>
                    </div>
                  </div>
                )}
                {next && (
                  <div>
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Next Event
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
              aria-label="Back to events"
            >
              &larr; Back to events
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
