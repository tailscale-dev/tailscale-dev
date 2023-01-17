import Link from 'next/link'
import { headerNavLinks } from '../data/headerNavLinks'

export default function LayoutWrapper({ children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 prose">
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between py-10">
          <div>
            <Link href="/">
              <div className="flex items-center justify-between">
                <div className="hidden h-6 text-2xl sm:block">
                  Tailscale Dev Community
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium sm:p-4"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </header>
        <main className="mb-auto">{children}</main>
      </div>
    </div>
  )
}