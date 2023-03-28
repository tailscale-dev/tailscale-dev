import { NextRequest } from 'next/server';
import { allBlogs, allAuthors } from 'contentlayer/generated';
import { generateRSS } from '../../lib/utils/generate-rss';
import { siteMetadata } from '../../data/site-metadata';

const handler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag');
  const feedUrl = tag ? `tags/${tag}/feed.xml` : 'feed.xml';
  const feed = await generateRSS(siteMetadata, allBlogs, allAuthors, tag, feedUrl);
  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  });
};

export default handler;

export const config = {
  runtime: 'edge',
};
