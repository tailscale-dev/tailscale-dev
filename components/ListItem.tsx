import Link from 'next/link';
import Tag from '@/components/Tag';

interface ListItemProps {
  slug: string;
  path: string;
  title: string;
  date: string;
  summary: string;
  location?: string;
  tags?: string[];
}

export function ListItem({ slug, title, date, location, path, tags=[], summary }: ListItemProps) {
  return (
    <li key={slug} className="py-6">
      <article>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold leading-8 tracking-tight">
              <Link href={path} className="text-gray-900 dark:text-gray-100">
                {title}
              </Link>
            </h2>

            <div className="font-mono text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
              <span className="pr-4">&frasl;&frasl;</span>
              <time dateTime={date}>{date}</time>
              { tags && tags.length > 0 &&
                <>
                  <span className="px-4">{` • `}</span>
                  <span>
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </span>
                </>
              }
              { location &&
                <>
                  <span className="px-4">{` • `}</span>
                  <span>{location}</span>
                </>
              }
            </div>
          </div>
          <div className="prose max-w-none text-gray-500 dark:text-gray-400">{summary}</div>
        </div>
      </article>
    </li>
  );
}
