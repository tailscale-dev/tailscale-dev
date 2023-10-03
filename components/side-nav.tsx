import React, { useState } from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';

type NavItemT = { label: string; link?: string; children?: NavItemT[] };
type Props = { item: NavItemT; isTopLevel?: boolean };

const NavItem = ({ item, isTopLevel }: Props) => {
  const router = useRouter();
  const pathAsKey = router.asPath.substring(1);
  const hasChildren = item.children && item.children.length;
  const absoluteLink = `/${item.link}`;
  const hasActiveChild = hasChildren && item.children.some((child) => child.link === pathAsKey);
  const [isOpen, setIsOpen] = useState(hasActiveChild);
  const isActive = item.link === pathAsKey;

  return (
    <li
      className="mt-0.5"
      onClick={
        !isTopLevel
          ? (e) => {
              e.stopPropagation();
              if (!hasChildren && item.link) {
                router.push(absoluteLink);
                return;
              } else if (hasChildren && !item.link) {
                setIsOpen(!isOpen);
                return;
              }
            }
          : null
      }
    >
      {hasChildren && !isTopLevel && !item.link ? (
        <div
          className={cx('py-1 px-2 rounded block', {
            'hover:bg-gray-300': !isTopLevel && ((hasChildren && !isOpen) || !hasChildren),
            'bg-gray-400': isActive,
            'cursor-pointer': !isTopLevel,
            'font-semibold': isTopLevel,
          })}
        >
          {item.label} {isOpen ? '-' : '+'}
        </div>
      ) : (
        <a
          href={absoluteLink}
          className={cx('py-1 px-2 rounded block', {
            'hover:bg-gray-300': !isTopLevel && ((hasChildren && !isOpen) || !hasChildren),
            'bg-gray-400': isActive,
            'cursor-pointer': !isTopLevel,
            'font-semibold': isTopLevel,
          })}
        >
          {item.label}
        </a>
      )}
      {(isOpen || isTopLevel) && hasChildren && (
        <ul className="pl-2">
          {item.children.map((child) => (
            <NavItem key={child.label} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

const SideNav = ({ items }) => {
  return (
    <nav
      className="
    sticky top-0 overflow-y-scroll overscroll-contain md:overscroll-auto
    h-full md:max-h-screen
    md:text-sm md:leading-tight
    bg-white md:bg-transparent shadow-xl md:shadow-none px-4 py-8 md:p-0 z-10"
    >
      <ul className="pl-2">
        {(items || []).map((item) => (
          <NavItem key={item.label} item={item} isTopLevel />
        ))}
      </ul>
    </nav>
  );
};

export default SideNav;
