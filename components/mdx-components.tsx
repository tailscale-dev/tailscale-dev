import React from 'react';
import * as _jsx_runtime from 'react/jsx-runtime';
import ReactDOM from 'react-dom';
import type { MDXComponents } from 'mdx/types';
import { coreContent } from '@/lib/utils/contentlayer';
import type { MDXDocument } from '@/lib/utils/contentlayer';

export type { MDXComponents as ComponentMap };

export interface MDXLayout {
  layout: string;
  content: MDXDocument;
  [key: string]: unknown;
}

export interface MDXLayoutRendererProps extends MDXLayout {
  MDXComponents?: MDXComponents;
}

const getMDXComponent = (
  code: string,
  globals: Record<string, unknown> = {}
): React.ComponentType<any> => {
  const scope = { React, ReactDOM, _jsx_runtime, ...globals };
  const fn = new Function(...Object.keys(scope), code);
  return fn(...Object.values(scope)).default;
};

// TS transpile it to a require which causes ESM error
// Copying the function from contentlayer as a workaround
// Copy of https://github.com/contentlayerdev/contentlayer/blob/main/packages/next-contentlayer/src/hooks/useMDXComponent.ts
export const useMDXComponent = (
  code: string,
  globals: Record<string, unknown> = {}
): React.ComponentType<any> => {
  return React.useMemo(() => getMDXComponent(code, globals), [code, globals]);
};

export const MDXLayoutRenderer = ({
  layout,
  content,
  MDXComponents,
  ...rest
}: MDXLayoutRendererProps) => {
  const MDXLayout = useMDXComponent(content.body.code);
  const mainContent = coreContent(content);

  return <MDXLayout layout={layout} content={mainContent} components={MDXComponents} {...rest} />;
};
