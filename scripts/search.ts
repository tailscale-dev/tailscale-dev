import { writeFileSync } from 'fs';
import { allCoreContent } from '@/lib/utils/contentlayer.js';
import { allBlogs } from '../.contentlayer/generated/index.mjs';
import { siteMetadata } from '../data/siteMetadata.js';

const search = () => {
  if (siteMetadata?.search?.kbarConfig?.searchDocumentsPath) {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(allCoreContent(allBlogs))
    );
  }
};
export default search;
