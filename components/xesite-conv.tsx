import { ReactNode } from 'react';
import Image from 'next/image';

export interface XesiteConvProps {
  name: string;
  mood: string;
  children: ReactNode;
}

export default function XesiteConv({ name, mood, children }: XesiteConvProps) {
  return (
    <>
      <div className="my-4 flex space-x-4 rounded-md border border-solid border-gray-200 bg-gray-100 p-3 dark:border-gray-700  dark:bg-gray-800">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center self-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
          <Image
            src={`https://cdn.xeiaso.net/sticker/${name.toLowerCase()}/${mood}/128`}
            width={64}
            height={64}
            alt={`A picture of the character ${name} in a ${mood} mood.}`}
          />
          <br />
        </div>
        <div className="xesite-body min-w-0 self-center">
          &lt;<b>{name}</b>&gt; {children}
        </div>
      </div>
    </>
  );
}
