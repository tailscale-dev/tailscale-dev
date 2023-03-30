/* eslint-disable react/display-name */
import React from 'react';
import { ComponentMap, MDXLayout } from './mdx';
import { HeroImage } from './hero-image';
import { ConvSnippet } from './conv-snippet';
import { TOCInline } from './toc-inline';
import ExternalLink from './external-link';
import { Pre } from './pre';
import { NewsletterRepublishing } from './newsletter-republishing';
import Image from './image';
import Warning from './warning';
import { Question } from './question';
import { Answer } from './answer';

export const Wrapper = ({ layout, content, ...rest }: MDXLayout) => {
  const Layout = require(`../layouts/${layout}`).default;
  return <Layout content={content} {...rest} />;
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
  Question,
  Answer,
};
