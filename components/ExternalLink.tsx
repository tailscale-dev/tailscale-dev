import React from 'react';

interface ExternalLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const ExternalLink = React.forwardRef<HTMLAnchorElement, ExternalLinkProps>((props, ref) => {
  const { onClick, ...rest } = props;

  const wrappedOnClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    if (onClick) {
      onClick(e);
    }
  };

  return <a ref={ref} {...rest} target="_blank" rel="noreferrer" onClick={wrappedOnClick} />;
});

ExternalLink.displayName = 'ExternalLink';

export default ExternalLink;
