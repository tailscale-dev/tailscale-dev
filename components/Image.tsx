import NextImage, { ImageProps } from 'next/image';
import Wrapper from './Wrapper';
import Link from './Link';

interface Image extends ImageProps {
  showCaption?: boolean;
  link?: string;
}

export default function Image(props: Image) {
  return (
    <>
      <Wrapper
      condition={props.link}
      wrapper={children => <Link href={props.link}>{children}</Link>}>
        <NextImage {...props} />
      </Wrapper>
      { props.showCaption &&
        <figcaption className="text-center">
          {props.alt}
        </figcaption>
        }
    </>
    
  );
  
}
