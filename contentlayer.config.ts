import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer/source-files';
import readingTime from 'reading-time';

// Remark packages
import remarkGfm from 'remark-gfm';
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from './lib/mdx-plugins';

// Rehype packages
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypePresetMinify from 'rehype-preset-minify';
import { formatDate } from './lib/utils/formatDate';

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: 'string', resolve: (doc) => extractTocHeadings(doc.body.raw) },
};

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' } },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'list', of: { type: 'string' } },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  },
}));

export const Events = defineDocumentType(() => ({
  name: 'Events',
  filePathPattern: 'events/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    location: { type: 'string', required: true },
    displayDate: { type: 'string' },
    displayTime: { type: 'string' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    link: { type: 'string' },
    layout: { type: 'string' },
    authors: { type: 'list', of: { type: 'string' } },
  },
  computedFields: {
    ...computedFields,
    displayDate: {
      type: 'string',
      resolve: (doc) => (doc.displayDate ? doc.displayDate : formatDate(doc.date)),
    },
  },
}));

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    handle: { type: 'string' },
    avatar: { type: 'string' },
    title: { type: 'string' },
    company: { type: 'string' },
    twitter: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
    website: { type: 'string' },
    fediverse: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    handle: {
      type: 'string',
      resolve: (doc) => (doc.handle ? doc.handle : doc.name.split(' ', 1)[0]),
    },
  },
}));

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Authors, Events],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [remarkExtractFrontmatter, remarkGfm, remarkCodeTitles, remarkImgToJsx],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      [rehypePrismPlus, { ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
});
