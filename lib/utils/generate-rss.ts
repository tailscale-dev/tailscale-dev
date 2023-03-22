import GithubSlugger from 'github-slugger';
import { escape } from './html-escaper';
import type { MDXAuthor, MDXBlog } from './contentlayer';

interface CoreConfig {
  title: string;
  description: string;
  language: string;
  siteUrl: string;
  siteRepo: string;
  locale: string;
}

const generateRssItem = (config: CoreConfig, post: MDXBlog, authorDetails) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${authorDetails.join(', ')}</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`;

const generateRss = (
  config: CoreConfig,
  allAuthors: MDXAuthor[],
  posts: MDXBlog[],
  page = 'feed.xml'
) => `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts
        .map((post) => {
          const authorList = post.authors || ['default'];
          const authorDetails = authorList.map((author) => {
            const authorObj = allAuthors.find((p) => p.slug === author);
            return authorObj.name;
          });
          return generateRssItem(config, post, authorDetails);
        })
        .join('')}
    </channel>
  </rss>
`;

export async function generateRSS(
  config: CoreConfig,
  allBlogs: MDXBlog[],
  allAuthors: MDXAuthor[],
  tag?: string,
  feedUrl?: string
) {
  const publishPosts = allBlogs
    .filter((post) => post.draft !== true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  // No tag? Generate RSS for all posts
  if (!tag) {
    return generateRss(config, allAuthors, publishPosts);
  }

  // Generate RSS for a tag
  const filteredPosts = allBlogs.filter((post) =>
    post.tags.map((t) => GithubSlugger.slug(t)).includes(tag)
  );
  return generateRss(config, allAuthors, filteredPosts, feedUrl);
}
