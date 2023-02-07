import { siteMetadata } from '@/data/siteMetadata';
import { PageSEO } from '@/components/SEO';
import { sortedFutureEventPosts, allCoreContent } from '@/lib/utils/contentlayer';
import { InferGetStaticPropsType } from 'next';
import { allEvents } from 'contentlayer/generated';
import type { Events } from 'contentlayer/generated';
import { ListItem } from '@/components/ListItem';

export const POSTS_PER_PAGE = 10;

export const getStaticProps = async () => {
  const events = sortedFutureEventPosts(allEvents) as Events[];
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
      <header className="bg-gray-900 py-20 text-center text-gray-100">
        <h1 className="text-4xl font-medium leading-tight tracking-tight">Events</h1>
      </header>
      <div className="container max-w-4xl">
        <ul>
          {events.map((event) => (
            <ListItem
              key={event.slug}
              title={event.title}
              slug={event.slug}
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
