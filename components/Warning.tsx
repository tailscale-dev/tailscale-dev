import { ReactNode } from 'react';
import GraphicalEmoji from './GraphicalEmoji';

export interface WarningProps {
  children: ReactNode;
}

export default function Warning({ children }: WarningProps) {
  return (
    <>
      <div className="warn justify mt-4 mb-2 flex items-start  rounded-lg bg-gray-100 p-6 text-gray-900 dark:bg-gray-800 dark:text-gray-50 md:max-w-lg">
        <div className="mr-4 max-w-fit shrink-0 rounded-md bg-yellow-700 py-2 px-4 text-gray-50 dark:bg-yellow-100 dark:text-gray-50">
          <span role="img" aria-label="warning" className="hidden shrink-0 md:block">
            <GraphicalEmoji emoji="⚠️" /> Warning
          </span>
          <span role="img" aria-label="warning" className="hidden sm:block md:hidden">
            <GraphicalEmoji emoji="⚠️" />
          </span>
        </div>
        {children}
      </div>
    </>
  );
}
