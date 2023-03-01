import React from 'react';
import { Inter } from '@next/font/google';
import { leftHeaderNavLinks, rightHeaderNavLinks } from '@/data/headerNavLinks';
import Link from 'next/link';
import Footer from './Footer';
import ThemeSwitch from './ThemeSwitch';
import { ReactNode } from 'react';
import { TailscaleLogo } from '@/components/TailscaleLogo';
import MobileNav from './MobileNav';

interface Props {
  children: ReactNode;
}

// guide: https://nextjs.org/docs/basic-features/font-optimization#with-tailwind-css
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const LayoutWrapper = ({ children }: Props) => {
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
                    className="px-3 font-medium  transition-colors duration-200 hover:text-gray-600"
                  >
                    <span>{link.title}</span>
                    {link.href.startsWith('http') && (
                      <span className="pl-1 text-gray-300">&#8599;</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
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
