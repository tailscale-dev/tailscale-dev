import { ReactNode } from "react";
import { allAuthors, Authors as Author } from "contentlayer/generated";
import Image from "next/image";

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
  const handle = author.name.split(" ", 1)[0];

  return (
    <div className="p-4 flex space-x-4 bg-gray-100 rounded-lg">
      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center self-center">
        <Image
          src={author.avatar}
          width={64}
          height={64}
          alt={`the avatar for ${author.name}`}
        />
      </div>
      <div className="self-center min-w-0">
        &lt;<b>{handle}</b>&gt; {children}
      </div>
    </div>
  );
};
