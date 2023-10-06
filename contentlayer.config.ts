import {
  ComputedFields,
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files';
import readingTime from 'reading-time';

// Remark packages
import remarkGfm from 'remark-gfm';
import {
  extractTocHeadings,
  remarkCodeTitles,
  remarkExtractFrontmatter,
  remarkImgToJsx,
} from './lib/mdx-plugins';

// Rehype packages
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePresetMinify from 'rehype-preset-minify';

// Code Hike (syntax highlighting)
import { remarkCodeHike } from '@code-hike/mdx';
import codeHikeTheme from './css/codeHikeTheme.json';

import { siteMetadata } from './data/site-metadata';

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
    summary: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, required: true },
    lastmod: { type: 'date' },
    images: { type: 'list', of: { type: 'string' } },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    draft: { type: 'boolean' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    url: {
      type: 'string',
      resolve: (doc) => `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
    },
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
    summary: { type: 'string', required: true },
    endsDate: { type: 'date' },
    displayDate: { type: 'string' },
    shortDisplayDate: { type: 'string' },
    displayTime: { type: 'string' },
    draft: { type: 'boolean' },
    link: { type: 'string' },
    layout: { type: 'string' },
    authors: { type: 'list', of: { type: 'string' } },
  },
  computedFields: {
    ...computedFields,
    displayDate: {
      type: 'string',
      resolve: (doc) => (doc.displayDate ? doc.displayDate : doc.date),
    },
    isFuture: {
      type: 'boolean',
      resolve: (doc) => {
        const date = new Date(doc.endsDate || doc.date);
        date.setDate(date.getDate() + 1);
        return date > new Date();
      },
    },
  },
}));

export const PronounSet = defineNestedType(() => ({
  name: 'PronounSet',
  fields: {
    display: { type: 'string', required: true },
    link: { type: 'string', required: true },
  },
}));

export const Solutions = defineDocumentType(() => ({
  name: 'Solution',
  filePathPattern: 'solutions/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    shortTitle: { type: 'string' },
    group: { type: 'string' },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    date: { type: 'date', required: true },
    summary: { type: 'string', required: true },
    authors: { type: 'list', of: { type: 'string' } },
    draft: { type: 'boolean' },
    layout: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    url: {
      type: 'string',
      resolve: (doc) => `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
    },
    displayDate: {
      type: 'string',
      resolve: (doc) => (doc.displayDate ? doc.displayDate : doc.date),
    },
    readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  },
}));

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string', required: true },
    handle: { type: 'string' },
    tailscalar: { type: 'boolean' },
    twitter: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
    website: { type: 'string' },
    fediverse: { type: 'string' },
    pronouns: { type: 'nested', of: PronounSet },
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
  documentTypes: [Blog, Authors, Events, Solutions],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkImgToJsx,
      [remarkCodeHike, { theme: codeHikeTheme, showCopyButton: true }],
    ],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypePresetMinify],
  },
});
