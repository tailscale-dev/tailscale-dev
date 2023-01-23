/* eslint-disable react/display-name */
import React from 'react'
import { MDXLayout, ComponentMap } from './mdx-components'
import { TOCInline } from './TOCInline'
import { Pre } from './Pre'

import Image from './Image'
import { HeroImage } from './HeroImage';
import CustomLink from './Link'

export const Wrapper = ({ layout, content, ...rest }: MDXLayout) => {
  const Layout = require(`../layouts/${layout}`).default
  return <Layout content={content} {...rest} />
}

export const MDXComponents: ComponentMap = {
  Image,
  HeroImage,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  wrapper: Wrapper,
}
