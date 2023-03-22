import { writeFileSync } from 'fs';
import { allCoreContent } from '@/lib/utils/contentlayer.js';
import { allBlogs } from '../.contentlayer/generated/index.mjs';
import { siteMetadata } from '../data/site-metadata.js';

const search = () => {
  if (siteMetadata?.search?.kbarConfig?.searchDocumentsPath) {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(allCoreContent(allBlogs))
    );
  }
};
export default search;
