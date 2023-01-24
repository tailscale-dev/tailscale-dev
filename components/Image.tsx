import React from 'react';
import NextImage, { ImageProps } from 'next/image';
import Wrapper from './Wrapper';
import Link from './Link';

interface ImageComponentProps extends ImageProps {
  showCaption?: boolean;
  link?: string;
}

export default function Image(props: ImageComponentProps) {
  return (
    <>
      <Wrapper
        condition={props.link}
        wrapper={(children) => <Link href={props.link}>{children}</Link>}
      >
        <NextImage {...props} />
      </Wrapper>
      {props.showCaption && <figcaption className="text-center">{props.alt}</figcaption>}
    </>
  );
}
