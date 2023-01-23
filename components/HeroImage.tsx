import { Image } from "next/image";

export type HeroImageAttrs = {
  name: string;
  desc: string;
  width: number;
  height: number;
  generator?: string;
};

const HeroImage = (
  { name, desc, width, height, generator }: HeroImageAttrs,
) => (
  <figure className="hero mx-1 my-6">
    <Image
      src={`/images/hero/${name}.png`}
      alt={desc}
      width={width}
      height={height}
    />
    {generator !== undefined
      ? (
        <figcaption className="text-gray-600 mx-2 my-1 text-center">
          Image generated by {generator}, prompt: {hero.desc}
        </figcaption>
      )
      : (
        <figcaption className="text-gray-600 mx-2 my-1 text-center">
          {desc}
        </figcaption>
      )}
    <meta property="og:image" content={`/images/hero/${name}.png`} />
  </figure>
);

export default HeroImage;
