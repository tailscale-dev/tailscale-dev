import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

export default function Breadcrumbs({ titleMap = {}, includeThisPage = true }) {
  const router = useRouter();

  function generateBreadcrumbs() {
    const asPathWithoutQuery = router.asPath.split('?')[0];
    const asPathNestedRoutes = asPathWithoutQuery.split('/').filter((v) => v.length > 0);

    return asPathNestedRoutes.map((subpath, idx) => {
      const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/');
      const title = titleMap[subpath]
        ? titleMap[subpath]
        : subpath.charAt(0).toUpperCase() + subpath.slice(1);

      return { href, title };
    });
  }

  const breadcrumbs = generateBreadcrumbs();
  if (!includeThisPage) {
    breadcrumbs.pop();
  }

  return (
    <div className="container px-5 py-3 border-none" aria-label="Breadcrumb">
      <ol aria-label="breadcrumb" className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-md font-medium  hover:text-blue-600 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              className="mr-2 h-4 w-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb, idx) => (
          <Crumb {...crumb} key={idx} last={idx === breadcrumbs.length - 1} />
        ))}
      </ol>
    </div>
  );
}

function Crumb({ title, href, last = false }) {
  return (
    <li className="text-md ml-1 font-medium hover:text-blue-600 md:ml-2">
      <div className="flex items-center">
        <svg
          aria-hidden="true"
          className="h-6 w-6 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
        {last ? title : <Link href={href}>{title}</Link>}
      </div>
    </li>
  );
}
