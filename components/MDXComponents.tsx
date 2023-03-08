/* eslint-disable react/display-name */
import React from 'react';
import { ComponentMap, MDXLayout } from './mdx-components';
import { HeroImage } from './HeroImage';
import { Note } from './Note';
import { ConvSnippet } from './ConvSnippet';
import { TOCInline } from './TOCInline';
import ExternalLink from './ExternalLink';
import DownloadTailscale from './DownloadTailscale';
import { Pre } from './Pre';
import { NewsletterRepublishing } from './NewsletterRepublishing';

import Image from './Image';

export const Wrapper = ({ layout, content, ...rest }: MDXLayout) => {
  const Layout = require(`../layouts/${layout}`).default;
  return <Layout content={content} {...rest} />;
};

export const MDXComponents: ComponentMap = {
  Image,
  HeroImage,
  DownloadTailscale,
  ConvSnippet,
  TOCInline,
  Note,
  NewsletterRepublishing,
  a: ExternalLink,
  pre: Pre,
  wrapper: Wrapper,
};
