import NextImage, { ImageProps } from 'next/image';

interface HeroImage extends ImageProps {
  desc: string;
  generator?: string;
}

export function HeroImage({ src, desc, width, height, generator }: HeroImage) {
  return (
    <figure className="hero mx-1 my-6 rounded-lg bg-gray-100 p-2">
      <NextImage src={src} alt={desc} width={width} height={height} className="rounded-lg" />
      {generator !== undefined ? (
        <figcaption className="mx-2 my-1 text-center text-gray-800">
          Image generated by {generator}, prompt: {desc}
        </figcaption>
      ) : (
        <figcaption className="mx-2 my-1 text-center text-gray-800">{desc}</figcaption>
      )}
      <meta property="og:image" content={`${src}`} />
    </figure>
  );
}
