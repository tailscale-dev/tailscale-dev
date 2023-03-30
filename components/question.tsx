import Image from 'next/image';
import { useTheme } from 'next-themes';
import NoSSRWrapper from './no-ssr-wrapper';

export const Question = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className="mb-4 mt-8 flex rounded-md bg-gray-100 py-4 pr-4 font-medium dark:bg-gray-800 ">
      <div className="w-18 flex flex-none items-center align-middle text-5xl text-gray-200">
        <NoSSRWrapper>
          <Image
            src={`/logo/Tailscale-Mark-${theme === 'dark' ? 'White' : 'Black'}.svg`}
            style={{ filter: 'opacity(70%)' }}
            alt="Tailscale logo"
            width={50}
            height={50}
          />
        </NoSSRWrapper>
      </div>
      <div className="blog-qa-question flex-initial">{children}</div>
    </div>
  );
};
