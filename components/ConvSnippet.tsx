import { ReactNode } from 'react';
import { allAuthors, Authors as Author } from 'contentlayer/generated';
import Image from 'next/image';

export interface ConvSnippetProps {
  name: string;
  children: ReactNode;
}

const findAuthor = (name: string): Author => {
  for (const author of allAuthors) {
    if (author.name == name) {
      return author;
    }
  }

  return allAuthors[0];
};

export const ConvSnippet = ({ name, children }: ConvSnippetProps) => {
  const author = findAuthor(name);
  const handle = author.name.split(' ', 1)[0];

  return (
    <div className="flex space-x-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center self-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
        <Image src={author.avatar} width={64} height={64} alt={`the avatar for ${author.name}`} />
      </div>
      <div className="min-w-0 self-center">
        &lt;<b>{handle}</b>&gt; {children}
      </div>
    </div>
  );
};
