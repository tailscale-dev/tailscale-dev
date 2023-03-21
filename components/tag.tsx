import React from 'react';
import Link from 'next/link';
import { kebabCase } from '@/lib/utils/kebab-case';
import { translateTag } from '@/lib/utils/translate-tag';

interface Props {
  text: string;
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-5 text-sm font-medium"
    >
      {translateTag(text)}
    </Link>
  );
};

export default Tag;
