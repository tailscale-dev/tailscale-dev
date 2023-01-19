
import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote'
import { Date } from '../components/Date';
//import { HeroImage } from '../components/HeroImage';
import { PostData } from '../lib/md';

//const components = { HeroImage };

export default function PostLayout({ data }: { data: PostData }) {
  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <h2>{data.title}</h2>
      <Date date={data.date} />

      <MDXRemote {...data.content} />

      <hr />

      <a href={`https://github.com/tailscale-dev/tailscale-dev/edit/main${data.repoPath}`} target='_blank'>Improve this page</a>
    </>
  )
};
