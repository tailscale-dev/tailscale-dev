import React from 'react';
import NextImage, { ImageProps } from 'next/image';
import Link from 'next/link';
import Wrapper from './wrapper';

interface ImageComponentProps extends ImageProps {
  showCaption?: boolean;
  href?: string;
  className?: string;
}

export default function Image(props: ImageComponentProps) {
  return (
    <>
      <Wrapper
        condition={props.href}
        wrapper={(children) => <Link href={props.href}>{children}</Link>}
      >
        <div className={`rounded-xl ${props.className ? props.className : 'max-w-full'}`}>
          <NextImage {...props} />
        </div>
      </Wrapper>
      {props.showCaption && <figcaption className="text-center">{props.alt}</figcaption>}
    </>
  );
}
