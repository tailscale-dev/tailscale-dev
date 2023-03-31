/* eslint-disable react/display-name */
import React, { ReactNode } from 'react';
import { ComponentMap, MDXLayout } from './mdx';
import { HeroImage } from './hero-image';
import { ConvSnippet } from './conv-snippet';
import { TOCInline } from './toc-inline';
import ExternalLink from './external-link';
import { Pre } from './pre';
import { NewsletterRepublishing } from './newsletter-republishing';
import Image from './image';
import Warning from './warning';
import XesiteConv from './xesite-conv';

export const Wrapper = ({ layout, content, ...rest }: MDXLayout) => {
  const Layout = require(`../layouts/${layout}`).default;
  return <Layout content={content} {...rest} />;
};

export const BlockQuote = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mt-4 mb-2 rounded-lg bg-gray-100 p-4 text-gray-900 dark:bg-gray-800 dark:text-gray-50 md:max-w-lg">
      {children}
    </div>
  );
};

export const MDXComponents: ComponentMap = {
  Image,
  HeroImage,
  ConvSnippet,
  TOCInline,
  NewsletterRepublishing,
  Warning: Warning,
  a: ExternalLink,
  pre: Pre,
  wrapper: Wrapper,
  XesiteConv: XesiteConv,
  BlockQuote,
};
