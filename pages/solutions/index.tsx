import { siteMetadata } from '@/data/site-metadata';
import { PageSEO } from '@/components/seo';
import SideNav from '@/components/side-nav';
import { allCoreContent, getSideNavData, sortedSolutionPosts } from '@/lib/utils/contentlayer';
import { InferGetStaticPropsType } from 'next';
import { allEvents, allSolutions } from 'contentlayer/generated';
import type { Solution } from 'contentlayer/generated';
import { ListItem } from '@/components/list-item';

export const POSTS_PER_PAGE = 10;

export const getStaticProps = async () => {
  const solutions = sortedSolutionPosts(allSolutions) as Solution[];
  const initialDisplayPosts = solutions.slice(0, POSTS_PER_PAGE);
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(solutions.length / POSTS_PER_PAGE),
  };

  return {
    props: {
      initialDisplayPosts: allCoreContent(initialDisplayPosts),
      solutions: allCoreContent(solutions),
      pagination,
      sideNavData: getSideNavData(solutions, allEvents),
    },
  };
};

export default function SolutionsPage({
  solutions,
  sideNavData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title="Solution" description={siteMetadata.description} />
      <header className="bg-gray-900 py-20 text-center text-gray-100">
        <h1 className="text-4xl font-medium leading-tight tracking-tight">Solutions</h1>
      </header>
      <div className="grid grid-cols-5 gap-x-8">
        <SideNav items={sideNavData} />
        <ul className="col-span-4">
          {solutions.map((event) => (
            <ListItem
              key={event.slug}
              title={event.title}
              slug={event.slug}
              path={event.path}
              summary={event.summary}
              date={event.displayDate}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
