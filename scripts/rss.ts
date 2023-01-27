import { generateRSS } from '../lib/utils/generate-rss';
import { siteMetadata } from '../data/siteMetadata';
import { allBlogs } from '../.contentlayer/generated/index.mjs';

const rss = () => {
  generateRSS(siteMetadata, allBlogs);
  console.log('RSS feed generated...');
};
export default rss;
