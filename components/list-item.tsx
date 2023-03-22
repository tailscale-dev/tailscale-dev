import Link from 'next/link';
import Tag from '@/components/tag';
import { DateDisplay } from '@/components/date-display';

interface ListItemProps {
  slug: string;
  path: string;
  title: string;
  date: string;
  summary: string;
  location?: string;
  tags?: string[];
}

export function ListItem({ slug, title, date, location, path, tags = [], summary }: ListItemProps) {
  return (
    <li key={slug} className="py-6">
      <article>
        <div className="space-y-6 text-gray-900 dark:text-white">
          <div>
            <h2 className="text-2xl font-bold leading-8 tracking-tight">
              <Link href={`/${path}`}>{title}</Link>
            </h2>

            <div className="font-mono text-base font-medium leading-6">
              <span className="pr-4">&frasl;&frasl;</span>
              <DateDisplay dateString={date} />
              {tags && tags.length > 0 && (
                <>
                  <span className="px-4">{` • `}</span>
                  <span className="uppercase">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </span>
                </>
              )}
              {location && (
                <>
                  <span className="px-4">{` • `}</span>
                  <span>{location}</span>
                </>
              )}
            </div>
          </div>
          <div className="prose max-w-none">{summary}</div>
        </div>
      </article>
    </li>
  );
}
