import { generateSitemap } from '@/lib/utils/generate-sitemap.js';
import { siteMetadata } from '../data/site-metadata.js';
import { allBlogs } from '../.contentlayer/generated/index.mjs';

const sitemap = () => {
  generateSitemap(siteMetadata.siteUrl, allBlogs);
  console.log('Sitemap generated...');
};
export default sitemap;
