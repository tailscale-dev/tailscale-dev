import Image from 'next/image';

export const Question = ({ children }) => {
  return (
    <div className="mb-4 mt-8 flex rounded-md bg-gray-100 py-4 pr-4 font-medium dark:bg-gray-100 dark:text-black">
      <div className="w-18 flex flex-none items-center align-middle text-5xl text-gray-200">
        <div>
          <Image
            src="/logo/Tailscale-Mark-Black.svg"
            style={{ filter: 'opacity(70%)' }}
            alt="Tailscale logo"
            width={50}
            height={50}
          />
        </div>
      </div>
      <div className="blog-qa-question flex-initial">{children}</div>
    </div>
  );
};
