import Link from 'next/link'
import Image from 'next/image'

import { headerNavLinks } from '../data/layout/header-nav-links'
import { ThemeSwitch } from './ThemeSwitch'

export default function LayoutWrapper({ children }) {
  return (
    <div>
      <div className="overflow-hidden bg-gray-900 text-white">
        <div className="container">
          <header className="flex items-center justify-between py-10 font-bold">
            <div>
              <Link href="/">
                <div className="flex items-center justify-between">
                  <div className="hidden h-6 text-3xl  font-bold sm:block">
                    Tailscale Community
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="hidden sm:block">
                {headerNavLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="p-1 sm:p-4"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </header>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
        <div className="flex flex-col justify-between ">
          <main>{children}</main>
          <div className="container flex flex-row-reverse flex-wrap pt-6 pb-12 sm:pt-12 md:pb-16">
            <div className="flex justify-between w-full mb-12 ml-auto md:w-3/5 md:mb-0">
              {/* <ul className="w-1/2 md:w-auto">
                <li className="footer-column-heading">Learn</li>
                <li className="mb-1"><a href="/learn/generate-ssh-keys/" className="footer-column-link">SSH Keys</a></li>
              </ul> */}
              <div className="w-1/2 md:w-auto">
                <span>Theme</span> <ThemeSwitch />
              </div>
            </div>
            <div className="max-w-xs mr-auto">
              <Link className="inline-block mb-5" href="/" aria-label="Tailscale">
                <Image src="/images/tailscale-logo.svg" width="120" height="34" alt="Tailscale logo" />
              </Link>
              <div className="text-xs text-gray-600">
                <p className="mb-2">WireGuard is a registered<br /> trademark of Jason A. Donenfeld.</p>
                <p className="mb-2">&copy; {new Date().getFullYear()} Tailscale Inc.</p>
                <p className="mt-2"><a href="/privacy-policy" className="underline">Privacy</a> & <a href="/terms" className="underline">Terms</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
