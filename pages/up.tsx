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
    title: 'Security Researcher',
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

const schedule = [
  {
    title: 'Check in & breakfast',
    time: '8:30-9:30am',
    break: true,
  },
  {
    title: 'Welcome & Introduction',
    who: 'MCs',
    time: '9:30am',
  },
  {
    title: 'All the buttons',
    who: 'Emily Trau',
    time: '9:50am',
  },
  {
    title: 'Build your own game streaming service',
    who: 'Justin Garrison',
    time: '10:15am',
  },
  {
    title: 'Adding out of band resilience to an ISP network',
    who: 'Moritz Frenzel',
    time: '10:40am',
  },
  {
    title: 'Break',
    time: '11:00am',
    break: true,
  },
  {
    title: 'Tailscale Self-Hosted Remote Cloud Gaming',
    who: 'Seaver Thorn',
    time: '11:20am',
  },
  {
    title: 'Your Family Needs Tailscale',
    who: 'Amye Scavarda Perrin',
    time: '11:45am',
  },
  {
    title: 'The subtle magic of embedding Tailscale into your services',
    who: 'Xe Iaso',
    time: '11:55am',
  },
  {
    title: 'Lunch and hang',
    time: '12:20pm',
    break: true,
  },
  {
    title: 'Lightning round... Ding ding ding',
    time: '2:00pm',
  },
  {
    title: 'Building a Never Ending Fantasy World With Tailscale',
    who: 'Oliver Judge',
    time: '2:30pm',
  },
  {
    title: 'Opportunity, connectivity and Tailscale',
    who: 'David Rio Deiros',
    time: '2:55pm',
  },
  {
    title: 'Tailscale as a Networking Layer for Modern Apps',
    who: 'Tarun Pothulapati',
    time: '3:20pm',
  },
  {
    title: 'Break',
    time: '3:40pm',
    break: true,
  },
  {
    title: 'Prison break: Free your Kubernetes clusters from firewalls with Tailscale and Pulumi',
    who: 'Guinevere Sanger & Aaron Friel',
    time: '4:00pm',
  },
  {
    title: 'The Managed NAT Gateway Time Machine',
    who: 'Corey Quinn',
    time: '4:20pm',
  },
  {
    title: 'Thank you',
    who: 'MCs',
    time: '5:00pm',
  },
  {
    title: 'Fiesta! with dinner / bevs',
    time: '5:00pm',
    break: true,
  },
  {
    title: 'Last call',
    time: '7:30pm',
    break: true,
  },
  {
    title: 'Finish',
    time: '8:00pm',
    break: true,
  },
];

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

      <header className="full-width text-center text-white">
        <div
          className="container max-w-6xl pb-12 lg:pb-32"
          style={{
            backgroundImage: 'url(/shapes/large.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
            backgroundSize: 'contain',
          }}
        >
          <div className="flex h-[500px] flex-col items-center justify-center lg:flex-row">
            <div className="lg:w-1/2">
              <Image
                src="/static/up/logo-white.svg"
                className="mx-auto"
                alt="Tailscale Up"
                width={426}
                height={82}
              />
            </div>
            <div className="text-left lg:w-1/2">
              <h1 className="text-light max-w-[582px] py-6 text-2xl">
                A conference for you to learn how others are using Tailscale at home and forge
                lasting connections in the community.
              </h1>

              <div className="flex justify-center lg:justify-start">
                <Link
                  href="https://ti.to/tailscaleup/2023"
                  target="_blank"
                  className="cta-button button-large text-white"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="bg-[#EFEEEC] dark:text-black">
          <div className="container max-w-6xl">
            <div className="flex flex-col py-24 lg:flex-row">
              <div className="pb-12 text-5xl font-semibold tracking-[-.04em] lg:w-1/2">
                Our first-ever, in-person conference!
              </div>
              <div className="text-lg lg:w-1/2">
                <div>
                  On May 31st Tailscale Up will be Tailscale&apos;s first-ever in-person conference
                  for the Tailscale community. Providing attendees the opportunity to meet with the
                  tailscalars and each other, talk about their projects and integrations, and leave
                  connected and inspired. A single track will be comprised of community speakers.
                </div>

                <div className="pt-4">
                  To stay updated on the latest developments and announcements about Tailscale Up,
                  check back regularly or follow our{' '}
                  <Link className="text-[#3A7BF3]" href="https://twitter.com/tailscale">
                    Twitter
                  </Link>{' '}
                  and our{' '}
                  <Link className="text-[#3A7BF3]" href="https://hachyderm.io/@tailscale">
                    Fediverse
                  </Link>{' '}
                  account. You won&apos;t want to miss out on this unique opportunity to meet and
                  learn from others in the Tailscale community as well as Tailscale team members.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="full-width">
          <div className="container max-w-6xl">
            <div className="pb-16 pt-24">
              <div className="inline text-5xl font-semibold tracking-[-.04em] text-offwhite">
                Featured speakers
              </div>

              <Image
                src="/shapes/small.svg"
                width={200}
                height={50}
                className="float-right hidden sm:block"
                alt="Tailscale shapes"
              />
            </div>

            <div className="flex flex-wrap pb-24">
              {featuredSpeakers.map((speaker) => (
                <div key={speaker.name} className="p-4 lg:w-1/2">
                  <div className="flex">
                    <div className="w-[100px]">
                      <Image
                        src={`/static/up/headshots/${speaker.headshot}`}
                        alt={`Headshot of ${speaker.name}`}
                        width={100}
                        height={100}
                      />
                    </div>

                    <div className="flex-1 pl-6 text-offwhite">
                      <div className="text-3xl font-semibold tracking-[-.04em]">{speaker.talk}</div>
                      <div className="pt-4 text-lg">{speaker.description}</div>
                      <div className="pt-4 text-lg">{speaker.name}</div>
                      <div className="text-lg text-gray-400">
                        {speaker.title}
                        {speaker.company && <> @ {speaker.company}</>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#EFEEEC] dark:text-black">
          <div className="container max-w-6xl">
            <div className="flex flex-col pt-24 sm:flex-row">
              <div className="hidden lg:block lg:w-1/2">
                <Image
                  src="/shapes/small.svg"
                  width={200}
                  height={50}
                  className="pb-16"
                  alt="Tailscale shapes"
                />
              </div>
              <div className="lg:w-1/2">
                <div className="pb-16 text-5xl font-semibold tracking-[-.04em]">Buy Tickets</div>
              </div>
            </div>
            <div className="flex flex-col pb-24 lg:flex-row">
              <div className="lg:w-1/2">
                <div className="pb-6 text-lg lg:pr-6">
                  Tickets are now available for $125. Ticket sales are limited, so act quickly!
                </div>
              </div>
              <div className="lg:w-1/2">
                <NoSSRWrapper>
                  <tito-widget event="tailscaleup/2023"></tito-widget>
                </NoSSRWrapper>
              </div>
            </div>
          </div>
        </div>

        <div className="full-width">
          <div className="container max-w-6xl">
            <div className="pt-24">
              <div className="inline text-5xl font-semibold tracking-[-.04em] text-offwhite">
                <a id="schedule">Schedule</a>
              </div>

              <Image
                src="/shapes/small.svg"
                width={200}
                height={50}
                className="float-right hidden sm:block"
                alt="Tailscale shapes"
              />
            </div>
            <div className="py-16 text-black sm:px-16">
              <div className="overflow-hidden bg-offwhite">
                <ul className="divide-y divide-gray-700">
                  {schedule.map((item, index) => (
                    <li
                      key={index}
                      className={`px-4 py-4 sm:px-6 ${item.break ? 'bg-black text-white' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="">{item.title}</p>
                          {item.who && <p className="truncate text-gray-600">{item.who}</p>}
                        </div>
                        <div className="ml-4 flex-shrink-0">{item.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#EFEEEC] text-black">
          <div className="container max-w-6xl">
            <div className="pb-16 pt-24">
              <Image
                src="/shapes/small.svg"
                width={200}
                height={50}
                className="float-right hidden sm:block"
                alt="Tailscale shapes"
              />
              <div className="tracking-[-.04em text-5xl font-semibold">The Venue</div>
              <div className="text-5xl font-light tracking-[-.04em]">DogPatch Studios</div>
            </div>

            <div className="flex h-[410px] justify-center">
              <Image
                src="/static/up/dogpatch-one.jpg"
                alt="An image of DogPatch Studios"
                className="hidden xl:inline xl:pr-6"
                width={437}
                height={398}
              />
              <Image
                src="/static/up/dogpatch-two.jpg"
                alt="An image of DogPatch Studios"
                className="float-right"
                width={606}
                height={398}
              />
            </div>
            <div className="flex flex-col py-24 lg:flex-row">
              <div className="lg:w-1/2">
                <div className="text-2xl font-bold tracking-[-.04em]">Food &amp; Drinks</div>
                <div className="py-4 pr-4 text-lg">
                  We are putting a lot of thought into the food and drink that will be served
                  throughout the day. This ain’t no regular conference food. We will announce
                  specifics in the coming weeks but there will be a clean breakfast, a variety of
                  food trucks for lunch, and dinner with craft beer and mocktails at the after-hours
                  social event. And an all day coffee cart, of course.
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="pt-12 text-2xl font-bold tracking-[-.04em] lg:pt-0">
                  After Hours
                </div>
                <div className="py-4 pr-4  text-lg">
                  We will stay onsite at Dogpatch to wrap up the conference with craft beer, natural
                  wines, and immaculate vibes. There will be food, board games, graphic novels, and
                  good company.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="full-width">
          <div className="container max-w-6xl">
            <div className="pt-20 text-3xl font-semibold tracking-[-.04em]">Getting There</div>
            <div className="flex flex-col pt-4 text-lg lg:flex-row">
              <div className="pr-6 lg:w-1/2">
                <div>
                  Located just one mile south of the Giants’ ballpark, Dogpatch is easily accessed
                  by bus, train, car, taxi, rideshare, MUNI (T-Line), or even by boat!
                </div>
              </div>
            </div>
            <div className="py-24">
              <NoSSRWrapper>
                <iframe
                  width="600"
                  height="400"
                  loading="lazy"
                  className="w-full"
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBHkIqBo-eTUgZEgAQ9Y7OjkB-bMxQ_hLQ&amp;q=Dogpatch+Studios&amp;center=37.7598449,-122.3914863&amp;zoom=14"
                ></iframe>
              </NoSSRWrapper>
            </div>
          </div>
        </div>

        <div className="full-width">
          <div className="container max-w-6xl">
            <div className="flex flex-col py-24 lg:flex-row">
              <div className="lg:w-1/2">
                <div className="text-3xl font-semibold tracking-[-.04em]">Partnerships</div>
                <div className="pt-6 pr-8 text-lg">
                  Building something that&apos;s the peanut butter to Tailscale&apos;s chocolate? If
                  you&apos;re interested in exploring potential partnership opportunities with us,
                  we invite you to email us at up@tailscale.com. We are open to discussing different
                  options for collaboration and finding creative ways to work together.
                </div>
              </div>
              <div className="pt-12 lg:w-1/2 lg:pt-0">
                <div className="text-3xl font-semibold tracking-[-.04em]">Code of Conduct</div>
                <div className="pt-6 text-lg">
                  Promoting a respectful and inclusive environment is a top priority for Tailscale
                  Up. Everyone will be expected to follow our{' '}
                  <Link
                    className="text-[#3A7BF3]"
                    href="https://tailscale.dev/events/code-of-conduct"
                  >
                    Code of Conduct
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#EFEEEC] dark:text-black">
          <div className="container max-w-6xl py-24">
            <div className="text-3xl font-semibold tracking-[-.04em]">
              Coronavirus (COVID-19) Information
            </div>
            <div className="pt-6 pr-8 text-lg">
              At Tailscale Up, we’ll implement the following safety measures to prevent the spread
              of Covid. We encourage all attendees to wear a mask and will be providing masks at the
              venue check-in table. We will require a negative test completed on the same day (tests
              provided to all attendees by mail before the event). Please do not attend if you are
              exhibiting symptoms.
            </div>

            <div className="pt-6 pr-8 text-lg">
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
