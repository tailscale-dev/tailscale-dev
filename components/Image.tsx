import React from 'react';
import NextImage, { ImageProps } from 'next/image';
import Link from 'next/link';
import Wrapper from './Wrapper';

interface ImageComponentProps extends ImageProps {
  showCaption?: boolean;
  href?: string;
}

export default function Image(props: ImageComponentProps) {
  return (
    <>
      <Wrapper
        condition={props.href}
        wrapper={(children) => <Link href={props.href}>{children}</Link>}
      >
        <NextImage {...props} />
      </Wrapper>
      {props.showCaption && <figcaption className="text-center">{props.alt}</figcaption>}
    </>
  );
}
