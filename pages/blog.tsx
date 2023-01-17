import { getAllFilesFrontMatter } from '../lib/md';
import ListLayout from '../layouts/ListLayout';
import { PostData } from '../lib/md';

export default function Articles({ posts }: { posts: PostData[] }) {
  console.log('artices', posts);
  return (
    <>
      <ListLayout
        items={posts}
        title="Blog"
      />
    </>
  )
}

export async function getStaticProps() {
  const posts = getAllFilesFrontMatter('blog', '/blog');
  return {
    props: {
      posts,
    },
  };
}