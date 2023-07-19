import React from 'react';
import { Inter } from '@next/font/google';
import { leftHeaderNavLinks, rightHeaderNavLinks } from '@/data/header-nav-links';
import Link from 'next/link';
import Footer from './footer';
import ThemeSwitch from './theme-switch';
import { ReactNode } from 'react';
import { TailscaleLogo } from '@/components/tailscale-logo';
import MobileNav from './mobile-nav';

interface Props {
  children: ReactNode;
}

// guide: https://nextjs.org/docs/basic-features/font-optimization#with-tailwind-css
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const LayoutWrapper = ({ children }: Props) => {
  const [query, setQuery] = React.useState('');

  return (
    <div className={`${inter.variable} font-sans`}>
      <nav className="SiteNavigation bg-gray-900 text-gray-100">
        <div className="container flex items-center justify-between py-4 md:pt-0">
          <div className="flex items-center">
            <Link className="mr-5 block md:pt-7" href="/" aria-label="Tailscale">
              <TailscaleLogo />
              <span className="pl-2 font-mono tracking-wider">
                <span className="pr-2 text-gray-700">~$</span>community
              </span>
            </Link>
            <ul className="relative hidden pt-8 md:flex">
              {leftHeaderNavLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    key={link.title}
                    href={link.href}
                    className="px-3 font-medium transition-colors duration-200 hover:text-gray-600"
                  >
                    <span>{link.title}</span>
                    {link.href.startsWith('http') && (
                      <span className="pl-1 text-gray-300">&#8599;</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-3 pt-8 sm:invisible md:visible">
              <div className="relative flex w-sm flex-wrap items-stretch">
                <input
                  type="search"
                  className="relative m-0 block w-sm min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="button-addon2"
                  onInput={(e) => setQuery(e.currentTarget.value)}
                  onSubmit={() => {
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                  }}
                  onKeyDown={(e) => {
                    if (document.activeElement == e.target && e.key === 'Enter') {
                      window.location.href = `/search?q=${encodeURIComponent(query)}`;
                    }
                  }}
                  value={query}
                />

                <span
                  className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                  id="basic-addon2"
                  onClick={() => {
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="px-3 pt-8 sm:visible md:invisible">
              <Link href="/search">Search</Link>
            </div>
          </div>
          <div className="ml-auto hidden pt-8 md:block">
            <ul className="flex items-center">
              {rightHeaderNavLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    key={link.title}
                    href={link.href}
                    className="px-3 font-medium  transition-colors duration-200 hover:text-gray-600"
                  >
                    <span>{link.title}</span>
                    {link.href.startsWith('http') && (
                      <span className="pl-1 text-gray-300">&#8599;</span>
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <ThemeSwitch />
              </li>
              <li className="ml-1 md:ml-4">
                <Link
                  href="https://login.tailscale.com/start"
                  data-track="Get Started Clicked"
                  className="button border-gray-100 border-opacity-20 font-medium  transition duration-150 ease-in-out hover:border-opacity-40"
                  target="_blank"
                  rel="noreferer noopener noreferrer"
                >
                  <span>Use Tailscale</span>
                </Link>
              </li>
            </ul>
          </div>
          <MobileNav />
        </div>
      </nav>
      {children}
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
