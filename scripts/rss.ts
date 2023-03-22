import { generateRSS } from '../lib/utils/generate-rss';
import { siteMetadata } from '../data/site-metadata';
import { allBlogs, allAuthors } from '../.contentlayer/generated/index.mjs';

const rss = () => {
  generateRSS(siteMetadata, allBlogs, allAuthors);
  console.log('RSS feed generated...');
};
export default rss;
