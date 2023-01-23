/* eslint-disable react/display-name */
import React from 'react';
import { ComponentMap, MDXLayout } from './mdx-components';
import { TOCInline } from './TOCInline';
import { Pre } from './Pre';

import Image from './Image';
import { HeroImage } from './HeroImage';
import { ConvSnippet } from './ConvSnippet';
import CustomLink from './Link';

export const Wrapper = ({ layout, content, ...rest }: MDXLayout) => {
  const Layout = require(`../layouts/${layout}`).default;
  return <Layout content={content} {...rest} />;
};

export const MDXComponents: ComponentMap = {
  Image,
  HeroImage,
  ConvSnippet,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  wrapper: Wrapper,
};
