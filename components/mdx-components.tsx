/* eslint-disable react/display-name */
import React, { ReactNode } from 'react';
import AprilFoolsWarning from './april-fools-warning';
import { ComponentMap, MDXLayout } from './mdx';
import { HeroImage } from './hero-image';
import { ConvSnippet } from './conv-snippet';
import { TOCInline } from './toc-inline';
import ExternalLink from './external-link';
import { Pre } from './pre';
import { NewsletterRepublishing } from './newsletter-republishing';
import Image from './image';
import Figure from './figure';
import Warning from './warning';
import { Question } from './question';
import { Answer } from './answer';
import XesiteConv from './xesite-conv';
import DownloadTailscale from './download-tailscale';
import { Note } from './note';

export const Wrapper = ({ layout, content, ...rest }: MDXLayout) => {
  const Layout = require(`../layouts/${layout}`).default;
  return <Layout content={content} {...rest} />;
};

export const BlockQuote = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mt-4 mb-2 rounded-lg bg-gray-100 p-4 text-gray-900 dark:bg-gray-800 dark:text-gray-50 md:max-w-lg">
      &gt; {children}
    </div>
  );
};

export const MDXComponents: ComponentMap = {
  Image,
  HeroImage,
  DownloadTailscale,
  Note,
  ConvSnippet,
  TOCInline,
  Figure,
  NewsletterRepublishing,
  Warning: Warning,
  a: ExternalLink,
  pre: Pre,
  wrapper: Wrapper,
  Question,
  Answer,
  XesiteConv: XesiteConv,
  BlockQuote,
  AprilFoolsWarning,
};
