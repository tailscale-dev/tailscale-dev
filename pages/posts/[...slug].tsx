
import PostLayout from '../../layouts/PostLayout';
import { getAllSlugs, getPostData } from '../../lib/md';
import { PostData } from '../../lib/md';

export async function getStaticPaths() {
  const paths = getAllSlugs('posts');
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const data = await getPostData('posts', params.slug);

  return {
    props: {
      data,
    },
  };
}

export default function Posts({ data }: { data: PostData }) {
  return (
    <>
      <PostLayout
        data={data}
      />
    </>
  )
}