import { MDXLayoutRenderer } from '@/components/mdx';
import PageTitle from '@/components/page-title';
import { MDXComponents } from '@/components/mdx-components';
import { sortedEventPosts, coreContent } from '@/lib/utils/contentlayer';
import { InferGetStaticPropsType } from 'next';
import { allEvents, allAuthors } from 'contentlayer/generated';

const DEFAULT_LAYOUT = 'event-layout';

export async function getStaticPaths() {
  return {
    paths: allEvents.map((p) => ({ params: { slug: p.slug.split('/') } })),
    fallback: false,
  };
}

export const getStaticProps = async ({ params }) => {
  const slug = (params.slug as string[]).join('/');
  const posts = sortedEventPosts(allEvents);
  const futurePosts = posts.filter((e) => e.isFuture);

  const postIndex = futurePosts.findIndex((p) => p.slug === slug);
  const prev = futurePosts[postIndex - 1] || null;
  const next = futurePosts[postIndex + 1] || null;
  const post = posts.find((p) => p.slug === slug);
  const authorList = post.authors || ['default'];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults);
  });

  return {
    props: {
      post,
      authorDetails,
      prev,
      next,
    },
  };
};

export default function EventPostPage({
  post,
  authorDetails,
  prev,
  next,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      {'draft' in post && post.draft === true ? (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      ) : (
        <MDXLayoutRenderer
          layout={post.layout || DEFAULT_LAYOUT}
          content={post}
          MDXComponents={MDXComponents}
          toc={post.toc}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
        />
      )}
    </>
  );
}
