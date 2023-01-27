import { siteMetadata } from '@/data/siteMetadata';
import { PageSEO } from '@/components/SEO';
import { sortedEvents, allCoreContent } from '@/lib/utils/contentlayer';
import { InferGetStaticPropsType } from 'next';
import { allEvents } from 'contentlayer/generated';
import type { Events } from 'contentlayer/generated';
import { ListItem } from '@/components/ListItem';

export const POSTS_PER_PAGE = 10;

export const getStaticProps = async () => {
  const events = sortedEvents(allEvents) as Events[];
  const initialDisplayPosts = events.slice(0, POSTS_PER_PAGE);
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(events.length / POSTS_PER_PAGE),
  };

  return {
    props: {
      initialDisplayPosts: allCoreContent(initialDisplayPosts),
      events: allCoreContent(events),
      pagination,
    },
  };
};

export default function EventPage({ events }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title="Event" description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
            Events
          </h1>
        </div>
        <ul>
          {events.map((event) => (
            <ListItem
              key={event.slug}
              title={event.title}
              path={event.path}
              location={event.location}
              summary={event.summary}
              date={event.displayDate}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
