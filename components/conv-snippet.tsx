import { ReactNode } from 'react';
import { Authors as Author } from 'contentlayer/generated';
import Image from 'next/image';

export interface ConvSnippetProps {
  authors: Author[];
  name: string;
  children: ReactNode;
}

export const ConvSnippet = ({ authors, name, children }: ConvSnippetProps) => {
  const author = authors.find((author) => author.name === name);

  if (!author) {
    throw new Error(`Author ${name} not found!`);
  }

  return (
    <div className="my-4 flex space-x-4 rounded-md border border-solid border-gray-200 bg-gray-100 p-3 dark:border-gray-700  dark:bg-gray-800">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center self-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
        <Image src={author.avatar} width={64} height={64} alt={`the avatar for ${author.name}`} />
      </div>
      <div className="conversation-chat min-w-0 self-center">
        &lt;<b>{author.handle}</b>&gt; {children}
      </div>
    </div>
  );
};
