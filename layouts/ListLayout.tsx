import Link from 'next/link';
import { formatDate } from '../lib/utils/formatDate';

import { FrontmatterData } from '../lib/md';

export default function ListLayout({ items, title }: { items: FrontmatterData[], title: string }) {
  return (
    <ul className="">
      {!items.length && 'None found.'}
      {items.map((item, i) => {
        return (
          <li key={i} className="pt-5">
            <Link href={item.link} className="text-2xl">
              {item.title}
            </Link>
            <p>
              {/* // TODO: Add markdown support */}
              {item.preview}
            </p>
            <p>
              // <time dateTime={item.date}>{formatDate(item.date)}</time>
            </p>
          </li>
        )
      })}
    </ul>
  )
}
