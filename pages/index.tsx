import Head from 'next/head'
import Image from 'next/image'

import { getAllFilesFrontMatter } from '../lib/md';
import ListLayout from '../layouts/ListLayout';
import { PostData } from '../lib/md';

export default function Home({ posts }: { posts: PostData[] }) {
  return (
    <>
      <Head>
        <title>Tailscale Community</title>
      </Head>

      <div>
        <ListLayout
          items={posts}
          title="Latest" />
      </div>
      
      <div className="ts-highlight grid grid-cols-3 gap-6 pt-4 text-center">
        <div>
          <Image src="/images/ssh.png" width="1024" height="556" alt="Tailscale SSH" className="object-fill h-48 w-50 rounded-t-2xl" />
          <h1 className="pt-4">Tailscale SSH</h1>
        </div>
        <div>
          <Image src="/images/tsnet.png" width="1024" height="556" alt="Tailscale - tsnet" className="object-fill h-48 w-50 rounded-t-2xl" />
          <h1 className="pt-4">tsnet</h1>
        </div>
        <div>
          <Image src="/images/funnel.png" width="1024" height="556" alt="Tailscale - Funnel" className="object-fill h-48 w-50 rounded-t-2xl" />
          <h1 className="pt-4">Funnel</h1>
        </div>
      </div>
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