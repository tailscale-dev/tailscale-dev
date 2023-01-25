import NextImage, { ImageProps } from 'next/image'

interface HeroImage extends ImageProps {
  desc: string;
  generator?: string;
}

export function HeroImage({
  src,
  desc,
  width,
  height,
  generator,
}: HeroImage) {
  return (
    <figure className='hero mx-1 my-6'>
      <NextImage
        src={src}
        alt={desc}
        width={width}
        height={height}
      />
      {generator !== undefined
        ? (
          <figcaption className='text-gray-600 mx-2 my-1 text-center'>
            Image generated by {generator}, prompt: {desc}
          </figcaption>
        )
        : (
          <figcaption className='text-gray-600 mx-2 my-1 text-center'>
            {desc}
          </figcaption>
        )}
      <meta property='og:image' content={`${src}`} />
    </figure>
  )
}