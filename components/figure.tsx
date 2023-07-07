import React from 'react';
import Image, { ImageComponentProps } from './image';

export interface FigureProps extends ImageComponentProps {}

export default function Figure(props: FigureProps) {
  return (
    <>
      <figure className="float-none text-center">
        <Image {...props} alt={props.alt} />
        <figcaption>{props.alt}</figcaption>
      </figure>
    </>
  );
}
