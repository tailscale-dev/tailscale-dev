import Link from 'next/link';
import { formatDate } from '../lib/utils/formatDate';

import { FrontmatterData } from '../lib/md';

export default function ListLayout({ items, title }: { items: FrontmatterData[], title: string }) {
  return (
    <div className="divide-y">
      <div className="space-y-2 pt-6">
        <h1 className="text-4xl font-extrabold">
          {title}
        </h1>
      </div>
      <ul>
        {!items.length && 'None found.'}
        {items.map((item, i) => {
          return (
            <li key={i} className="py-4">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6">
                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                  </dd>
                </dl>
                <div className="space-y-3 xl:col-span-3">
                  <div>
                    <h3 className="text-2xl font-bold leading-8 tracking-tight">
                      {item.link &&
                        // TODO: Add report this link that opens Github issue w/ Template (ex: irrelevant)
                        <Link href={item.link}>
                          {item.title}
                        </Link>
                      }
                    </h3>
                    {item.tags && item.tags.length > 0 &&
                      <div className="flex flex-wrap">
                        {item.tags.map((tag) => (
                          <span>{tag}</span>
                        ))}
                      </div>
                    }
                  </div>
                  <div className="prose max-w-none">
                    {/* // TODO: Add markdown support */}
                    {item.summary}
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
