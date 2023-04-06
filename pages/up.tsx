import Script from 'next/script';
import Link from 'next/link';
import NoSSRWrapper from '@/components/no-ssr-wrapper';

import * as React from 'react';
import Head from 'next/head';
import Image from 'next/image';

import { PageSEO } from '@/components/seo';

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

const featuredSpeakers = [
  {
    name: 'Amye Scavarda Perrin',
    title: 'Director of Developer Programs',
    company: 'CNCF',
    talk: 'Your family needs Tailscale',
    description:
      'With the power of Tailscale and Pi-hole combined, you too can have your household internet free of pesky popups, attention grabbers and possibly misleading claims to have won an iPhone.',
    headshot: 'amye-scavarda-perrin.jpg',
  },
  {
    name: 'Justin Garrison',
    title: 'Developer Advocate',
    company: 'AWS',
    talk: 'Build your own game streaming service',
    description:
      'Streaming games from the cloud is great, but how can you get the same flexibility with existing hardware? Using Tailscale with Steam we can game from anywhere, anytime, on any device.',
    headshot: 'justin-garrison.jpg',
  },
  {
    name: 'Emily Trau',
    talk: 'All the buttons',
    description:
      "What kind of user experiences can you build if you use every trick in the Tailscale book - features that are old, new, and even unreleased? We built a hacking attack/defense simulation platform, and want to show you what's possible when you commit Tailscale crimes.",
    headshot: 'emily-trau.jpg',
  },
  {
    name: 'Corey Quinn',
    title: 'Chief Cloud Economist',
    company: 'The Duckbill Group',
    talk: 'The managed NAT gateway time machine',
    description:
      'Via the magic of Tailscale, the presenter will do the (financially) impossible: pass traffic through two AWS Managed NAT Gateways. This in turn creates a vortex that is so phenomenally expensive that it warps the very fabric of space and time. That vortex will then be used to take the audience on a living tour of the history of crappy VPNs, hilariously bad multicloud networking attempts, and bear living witness to the actual moment Cisco set off down its path to become a sad corporate dragon with no friends.',
    headshot: 'corey-quinn.jpg',
  },
];

function Headshot(props: { speaker: (typeof featuredSpeakers)[0] }) {
  return (
    <div className="hidden sm:block">
      <div className="flex w-64 flex-none items-center justify-center">
        <Image
          src={`/static/up/headshots/${props.speaker.headshot}`}
          alt={`Headshot of ${props.speaker.name}`}
          className="rounded-full  border-gray-200 dark:border-gray-700"
          width={170}
          height={170}
        />
      </div>
    </div>
  );
}

function Bio(props: { speaker: (typeof featuredSpeakers)[0] }) {
  return (
    <div className="hidden w-64 flex-none lg:block">
      <div className="h-full">
        <div className="text-3xl font-medium">{props.speaker.name}</div>
        <div className="pt-4">
          {props.speaker.title && <span className="font-medium">{props.speaker.title}</span>}
          {props.speaker.company && <div>@ {props.speaker.company}</div>}
          <br />
        </div>
      </div>
    </div>
  );
}

export default function Up() {
  return (
    <>
      <PageSEO
        title="Tailscale Up - San Francisco, CA - May 31, 2023"
        description="A conference for you to learn how others are using Tailscale at home and forge lasting connections in the community."
        image="/static/up/social.png"
      />
      <Script src="https://js.tito.io/v2" strategy="lazyOnload" />

      <Head>
        <title>Tailscale Up - San Francisco, CA - May 31, 2023</title>
        <meta
          name="description"
          content="A conference for you to learn how others are using Tailscale at home and forge lasting
          connections in the community."
        />
      </Head>

      <header
        className=" bg-gray-900 py-20 text-center text-gray-100"
        style={{
          backgroundImage: 'url(/static/up/skyline.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center bottom',
        }}
      >
        <div>
          <Image
            src="/static/up/logo-white.svg"
            className="mx-auto"
            alt="Tailscale Up"
            width={300}
            height={75}
          />
        </div>

        <h1 className="mx-auto max-w-xl py-6 text-3xl font-medium leading-tight tracking-tight">
          A conference for you to learn how others are using Tailscale at home and forge lasting
          connections in the community.
        </h1>
        <div className="text-lg">
          May 31, 2023
          <br />
          San Francisco, CA USA
        </div>

        <Link
          href="https://ti.to/tailscaleup/2023"
          target="_blank"
          className="cta-button button-large mt-6 block whitespace-nowrap text-white"
        >
          Register
        </Link>
      </header>

      <main className="container max-w-5xl">
        <div className="mx-auto max-w-2xl pt-6">
          On May 31 Tailscale Up will be Tailscale&apos;s first-ever in-person conference for the
          Tailscale community. Providing attendees the opportunity to meet with the tailscalars and
          each other, talk about their projects and integrations, and leave connected and inspired.
          A single track will be comprised of community speakers.
          <br />
          <br />
          To stay updated on the latest developments and announcements about Tailscale Up, check
          back regularly or follow our{' '}
          <Link href="https://twitter.com/tailscale" className="text-blue-500" target="_blank">
            Twitter
          </Link>{' '}
          and our{' '}
          <Link href="https://hachyderm.io/@tailscale" className="text-blue-500" target="_blank">
            Fediverse
          </Link>{' '}
          account. You won&apos;t want to miss out on this unique opportunity to meet and learn from
          others in the Tailscale community as well as Tailscale team members.
        </div>
        <div>
          <h2 className="pt-10 pb-4 text-center text-3xl font-bold leading-8 tracking-tight">
            Featured Speakers
          </h2>
          <div className="pb-2 text-center">Stay tuned for our full speaker lineup</div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {featuredSpeakers.map((speaker, index) => (
              <div key={speaker.name} className="flex py-6">
                {index % 2 === 0 ? <Bio speaker={speaker} /> : <Headshot speaker={speaker} />}

                <div className="flex-auto px-6">
                  <div className="lg:hidden">
                    <div className="text-3xl font-medium">{speaker.name}</div>
                    <div className="pt-4">
                      <span className="font-medium">
                        {speaker.title}
                        {speaker.company && <> @ {speaker.company}</>}
                      </span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">{speaker.talk}</div>
                  <div className="pt-4">{speaker.description}</div>
                </div>

                {index % 2 !== 0 ? <Bio speaker={speaker} /> : <Headshot speaker={speaker} />}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="pt-10 pb-6 text-center text-3xl font-bold leading-8 tracking-tight">
            Food &amp; Drinks
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="mx-auto">
              <Image
                src="/static/up/food-truck.svg"
                alt="An image of a food truck"
                width={209}
                height={110}
              />
            </div>

            <div className="sm:col-span-2">
              We are putting a lot of thought into the food and drink that will be served throughout
              the day. This ain’t no regular conference food. We will announce specifics in the
              coming weeks but there will be a clean breakfast, a variety of food trucks for lunch,
              and dinner with craft beer and mocktails at the after-hours social event. And an all
              day coffee cart, of course.
            </div>
          </div>
        </div>

        <div>
          <h2 className="pt-10 pb-6 text-center text-3xl font-bold leading-8 tracking-tight">
            After hours
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-5">
            <div className="mx-auto sm:hidden">
              <Image src="/static/up/beer.svg" alt="An image of beer" width={78} height={110} />
            </div>

            <div className="sm:col-span-4">
              We will stay onsite at Dogpatch to wrap up the conference with craft beer, natural
              wines, and immaculate vibes. There will be food, board games, graphic novels, and good
              company.
            </div>

            <div className="hidden sm:block">
              <Image src="/static/up/beer.svg" alt="An image of beer" width={78} height={110} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="pt-10 pb-6 text-center text-3xl font-bold leading-8 tracking-tight">
            The Venue
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="w-full">
              <div className="pb-4 text-xl font-bold">Dogpatch Studios</div>
              <div>
                991 Tennessee St
                <br />
                San Francisco, CA 94107
              </div>
              <div className="pt-4">
                Located on the hip side of Potrero Hill just one mile south of the Giants’ ballpark,
                Dogpatch is easily accessed by bus, train, car, taxi, rideshare, MUNI (T-Line), or
                even by boat!
              </div>
            </div>
            <div className="col-span-2">
              <NoSSRWrapper>
                <iframe
                  width="600"
                  height="350"
                  loading="lazy"
                  className="w-full rounded-md"
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBHkIqBo-eTUgZEgAQ9Y7OjkB-bMxQ_hLQ&amp;q=Dogpatch+Studios&amp;center=37.7598449,-122.3914863&amp;zoom=14"
                ></iframe>
              </NoSSRWrapper>
            </div>
          </div>
        </div>

        <div>
          <h2 className="pt-10 pb-6 text-center text-3xl font-bold leading-8 tracking-tight">
            Accommodations
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="mx-auto">
              <Link href="https://www.hotelvia.com/">
                <Image
                  src="/static/up/hotel-via.svg"
                  alt="Hotel Via logo"
                  width={288}
                  height={197}
                />
              </Link>
            </div>

            <div className="col-span-2">
              <div>
                We have partnered up with Hotel VIA to provide a negotiated rate for attendees.
                Please book your room as soon as possible as the hotel is expected to sell out. The
                deadline to book at the negotiated rate is Saturday, April 29th.
              </div>
              <Link
                className="cta-button button-large my-6 mx-auto block whitespace-nowrap text-white"
                target="_blank"
                href="https://res.windsurfercrs.com/ibe/details.aspx?propertyid=14840&nights=1&checkin=5/30/2023&group=8135285&lang=en-us"
              >
                Book now
              </Link>
              <div>
                Getting to the venue from the hotel is easy. The hotel is located just 1.4 miles
                from the venue. You can walk, use a rideshare service like Uber or Lyft, or take
                public transit. For public transit, take the T-train from 4th and King Street to
                20th Street and pay ahead of time with{' '}
                <Link
                  href="https://www.clippercard.com/ClipperWeb/pay-with-phone"
                  className="text-blue-500"
                >
                  Clipper
                </Link>
                .
              </div>
            </div>
          </div>
        </div>

        <div id="tickets">
          <h2 className="pt-10 pb-6 text-center text-3xl font-bold leading-8 tracking-tight">
            Tickets
          </h2>
          <div>
            <div className="mx-auto max-w-2xl">
              <div className="pb-4">
                Tickets are on sale now!
                <br />
                <br />
                Ticket sales are limited, so act quickly! Early-bird tickets are available for $75.
                <br />
                Standard tickets will go on sale for $200 starting April 11th.
              </div>
              <NoSSRWrapper>
                <tito-widget event="tailscaleup/2023"></tito-widget>
              </NoSSRWrapper>
            </div>
          </div>
        </div>

        <div>
          <h2 className="pt-10 pb-6 text-center text-3xl font-bold leading-8 tracking-tight">
            Partnerships
          </h2>
          <div className="mx-auto max-w-2xl">
            <div>
              Building something that&apos;s the peanut butter to Tailscale&apos;s chocolate? If
              you&apos;re interested in exploring potential partnership opportunities with us, we
              invite you to email us at <code>up@tailscale.com</code>. We are open to discussing
              different options for collaboration and finding creative ways to work together.
            </div>
          </div>
        </div>

        <div>
          <h2 className="pt-10 pb-6 text-center text-3xl font-bold leading-8 tracking-tight">
            Code of Conduct
          </h2>
          <div className="mx-auto max-w-2xl">
            Promoting a respectful and inclusive environment is a top priority for Tailscale Up.
            <br />
            Everyone will be expected to follow our{' '}
            <Link className="text-blue-500" href="https://tailscale.dev/events/code-of-conduct">
              Code of Conduct
            </Link>
            .
          </div>
        </div>

        <div>
          <h2 className="pt-10 pb-6 text-center text-3xl font-bold leading-8 tracking-tight">
            Coronavirus (COVID-19) information
          </h2>
          <div className="mx-auto max-w-2xl">
            <div>
              At Tailscale Up, we’ll implement the following safety measures to prevent the spread
              of Covid. We encourage all attendees to wear a mask and will be providing masks at the
              venue check-in table. We will require a negative test completed on the same day (tests
              provided to all attendees by mail before the event). Please do not attend if you are
              exhibiting symptoms.
            </div>
            <div className="pt-4">
              We offer a full refund if you are unable to attend. These measures will be reviewed
              and updated to reflect the changing situation and number of cases as we approach the
              conference date.
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
