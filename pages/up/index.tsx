import Script from 'next/script';
import Link from 'next/link';
import NoSSRWrapper from '@/components/NoSSRWrapper';

import * as React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

interface TitoWidgetProps extends React.HTMLAttributes<HTMLElement> {
  event: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tito-widget': TitoWidgetProps;
    }
  }
}

export default function Up() {
  return (
    <>
      <Script src="https://js.tito.io/v2" strategy="lazyOnload" />

      <header className="bg-gray-900 py-20 text-center text-gray-100">
        <h1 className="text-4xl font-medium leading-tight tracking-tight">Tailscale Up</h1>
        <span>Bay Area, CA - May 31, 2023</span>
      </header>

      <Breadcrumbs titleMap={{ up: 'Tailscale Up', cfs: 'CFS' }} />

      <main className="Markdown BlogMarkdown container grid grid-cols-3 py-12 md:gap-16">
        <div className="col-span-3 lg:col-span-2">
          <h1 className="font-mono">you@tsdev:~$ tailscale up</h1>
          <div className="py-6">
            On May 31 Tailscale Up will be Tailscale&apos;s first-ever in-person community
            conference. Attendees will have the opportunity to hang with Tailscalars and share
            knowledge with one another to talk about projects and integrations and leave connected
            and inspired.
            <br />
            <br />
            We will host a single track of talks sourced directly from the community. That&apos;s
            you! Interested in speaking?{' '}
            <Link href="https://sessionize.com/tailscaleup/">Our CFP is open</Link>. We&apos;re
            looking for your story of network simplicity, security, & self determination in 5 minute
            lightning, 20 minute short, or 40 minute long format.
          </div>

          <h2>Call for proposals</h2>
          <div className="py-6">
            We&apos;d like to hear more about how you&apos;re using Tailscale with your:
            <ul>
              <li>Open Source projects</li>
              <li>Hardware</li>
              <li>Gaming</li>
              <li>Continuous Integration / Continuous Deployment</li>
              <li>Remote Development</li>
              <li>Amateur Radio</li>
              <li>Networking crimes</li>
            </ul>
            <p className="pb-6">Taking submissions until March 24</p>
            <Link
              href="https://sessionize.com/tailscaleup"
              className="cta-button button-large block whitespace-nowrap text-white"
            >
              Submit a proposal
            </Link>
          </div>

          <h2>Register</h2>
          <div className="py-6">
            Early Bird tickets on sale now for $75. Starting April 11, standard tickets will be
            $200. Both are limited.
          </div>
          <NoSSRWrapper>
            <tito-widget event="tailscaleup/2023"></tito-widget>
          </NoSSRWrapper>

          <h2>FAQ</h2>
          <div className="py-6">
            <dl>
              <dt className="py-3 font-bold">Do I need to be a customer?</dt>
              <dd className="pb-3">
                Tailscale up is open to *all* users! Not using Tailscale yet?{' '}
                <Link href="https://login.tailscale.com/start">Start free</Link>.
              </dd>

              <dt className="py-3 font-bold">Where will the event be held?</dt>
              <dd className="pb-3">
                In the Bay Area of California. Exact location is yet to be announced.
              </dd>
            </dl>
          </div>

          <h2>Code of Conduct</h2>
          <div className="py-6">
            The code of conduct for our events is available{' '}
            <Link href="/events/code-of-conduct">here</Link>.
          </div>
        </div>
        <div className="sticky top-0 hidden self-start lg:block">
          <h2 className="text-center text-xl">Call for Speakers</h2>
          <p className="py-2">
            We&apos;re looking for your story of network simplicity, security, & self determination
            in 5 minute lightning, 20 minute short, or 40 minute long format.
          </p>
          <Link
            href="https://sessionize.com/tailscaleup"
            className="cta-button button-large block w-full whitespace-nowrap text-white"
          >
            Submit
          </Link>
        </div>
      </main>
    </>
  );
}
