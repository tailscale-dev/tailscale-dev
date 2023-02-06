import { MDXLayoutRenderer } from '@/components/mdx-components';
import PageTitle from '@/components/PageTitle';
import { MDXComponents } from '@/components/MDXComponents';
import { sortedEventPosts, coreContent } from '@/lib/utils/contentlayer';
import { InferGetStaticPropsType } from 'next';
import { allEvents, allAuthors } from 'contentlayer/generated';
import type { Events } from 'contentlayer/generated';

const DEFAULT_LAYOUT = 'EventLayout';

export async function getStaticPaths() {
  console.log(
    '>>>>>',
    allEvents.map((p) => ({ params: { slug: p.slug.split('/') } }))
  );
  return {
    paths: allEvents.map((p) => ({ params: { slug: p.slug.split('/') } })),
    fallback: false,
  };
}

export const getStaticProps = async ({ params }) => {
  const slug = (params.slug as string[]).join('/');
  const sortedPosts = sortedEventPosts(allEvents) as Events[];
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug);
  const prevContent = sortedPosts[postIndex + 1] || null;
  const prev = prevContent ? coreContent(prevContent) : null;
  const nextContent = sortedPosts[postIndex - 1] || null;
  const next = nextContent ? coreContent(nextContent) : null;
  const post = sortedPosts.find((p) => p.slug === slug);
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
