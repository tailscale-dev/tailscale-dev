import { ReactNode } from 'react';
import Image from 'next/image';

export interface XesiteConvProps {
  name: string;
  mood: string;
  children: ReactNode;
}

const widths = {
  aoi: {
    coffee: 64,
    facepalm: 64,
    wut: 64,
  },
  mara: {
    happy: 42,
    hacker: 49,
  },
};

export default function XesiteConv({ name, mood, children }: XesiteConvProps) {
  return (
    <>
      <div className="my-4 flex space-x-4 rounded-md border border-solid border-gray-200 bg-gray-100 p-3 dark:border-gray-700  dark:bg-gray-800">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center self-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
          <Image
            src={`/images/xe/stickers/${name.toLowerCase()}/${mood}.png`}
            height={64}
            width={widths[name.toLowerCase()][mood]}
            alt={`A picture of the character ${name} in a ${mood} mood.}`}
          />
          <br />
        </div>
        <div className="conversation-chat min-w-0 self-center">
          &lt;<b>{name}</b>&gt; {children}
        </div>
      </div>
    </>
  );
}
