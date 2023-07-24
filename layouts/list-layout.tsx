import React from 'react';
import { useRouter } from 'next/router';
import { CoreContent } from '@/lib/utils/contentlayer';
import type { Blog } from 'contentlayer/generated';
import Link from 'next/link';
import { ListItem } from '@/components/list-item';
import SearchBar from '@/components/search-bar';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[];
  title: string;
  initialDisplayPosts?: CoreContent<Blog>[];
  pagination?: PaginationProps;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const basePath = router.pathname.split('/')[1];
  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  );
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts = posts || initialDisplayPosts;

  return (
    <>
      <header className="bg-gray-900 py-20 text-center text-gray-100">
        <h1 className="text-4xl font-medium leading-tight tracking-tight">{title}</h1>
        <div className="flex justify-center mt-6">
          <div className="px-3 pt-8 max-w-md items-center sm:invisible md:visible">
            <SearchBar />
          </div>
        </div>
      </header>
      <main className="container max-w-4xl">
        <ul>
          {displayPosts.map((post) => (
            <ListItem
              key={post.slug}
              title={post.title}
              slug={post.slug}
              path={post.path}
              tags={post.tags}
              summary={post.summary}
              date={post.date}
            />
          ))}
        </ul>
        {pagination && pagination.totalPages > 1 && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        )}
      </main>
    </>
  );
}
