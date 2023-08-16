import React from 'react';
import { Inter } from '@next/font/google';
import { leftHeaderNavLinks, rightHeaderNavLinks } from '@/data/header-nav-links';
import Link from 'next/link';
import Footer from './footer';
import ThemeSwitch from './theme-switch';
import { ReactNode } from 'react';
import { TailscaleLogo } from '@/components/tailscale-logo';
import MobileNav from './mobile-nav';
import { useRouter } from 'next/router';
import SearchBar from './search-bar';

interface Props {
  children: ReactNode;
}

const SearchIcon = () => (
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
);

// guide: https://nextjs.org/docs/basic-features/font-optimization#with-tailwind-css
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// When these pages are loaded, we want to hide the search bar.
const searchBarForbiddenPaths = ['/search', '/blog', '/solutions', '/tags/[tag]'];

const LayoutWrapper = ({ children }: Props) => {
  const router = useRouter();

  const noSearch = searchBarForbiddenPaths.includes(router.pathname);

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
            <ul className="relative hidden pt-8 md:flex items-center flex">
              {leftHeaderNavLinks.map((link) => (
                <>
                  <li key={link.title}>
                    <Link
                      key={link.title}
                      href={link.href}
                      className="px-1.5 lg:px-2 xl:px-3 font-medium transition-colors duration-200 hover:text-gray-600"
                    >
                      <span>{link.title}</span>
                      {link.href.startsWith('http') && (
                        <span className="pl-0.5 text-gray-300">&#8599;</span>
                      )}
                    </Link>
                  </li>
                </>
              ))}
              {noSearch ? (
                <li className="px-1.5 lg:px-2 xl:px-3 font-medium transition-colors duration-200 hover:text-gray-600">
                  <Link href="/search">
                    <span className="hidden md:block lg:hidden">
                      <SearchIcon />
                    </span>
                    <span className="hidden lg:block">Search</span>
                  </Link>
                </li>
              ) : (
                <>
                  <div className="px-1.25 lg:px-2 xl:px-3 pt-8 hidden md:block lg:hidden">
                    <Link
                      className="font-medium transition-colors duration-200 hover:text-gray-600"
                      href="/search"
                    >
                      <SearchIcon />
                    </Link>
                  </div>

                  <div className="px-3 pt-8 w-sm hidden lg:block">
                    <SearchBar />
                  </div>
                </>
              )}
            </ul>
          </div>
          <div className="ml-auto hidden pt-8 md:block">
            <ul className="flex items-center">
              {rightHeaderNavLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    key={link.title}
                    href={link.href}
                    className="px-1.5 lg:px-2 xl:px-3 font-medium transition-colors duration-200 hover:text-gray-600"
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
              <li className="ml-0.5 md:ml-1.5 xl:ml-4">
                <Link
                  href="https://login.tailscale.com/start"
                  data-track="Get Started Clicked"
                  className="button border-gray-100 border-opacity-20 font-medium  transition duration-150 ease-in-out hover:border-opacity-40"
                  target="_blank"
                  rel="noreferer noopener noreferrer"
                >
                  <span className="hidden md:block">Login</span>
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
