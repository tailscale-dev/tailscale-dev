import Link from 'next/link';
import Tag from '@/components/Tag';
import { DateDisplay } from '@/components/DateDisplay';

interface ListItemProps {
  slug: string;
  title: string;
  date: string;
  summary: string;
  location?: string;
  tags?: string[];
}

export function ListItem({ slug, title, date, location, tags = [], summary }: ListItemProps) {
  return (
    <li key={slug} className="py-6">
      <article>
        <div className="space-y-6 text-gray-900 dark:text-white">
          <div>
            <h2 className="text-2xl font-bold leading-8 tracking-tight">
              <Link href={`/${slug}`}>{title}</Link>
            </h2>

            <div className="font-mono text-base font-medium leading-6">
              <span className="pr-4">&frasl;&frasl;</span>
              <DateDisplay dateString={date} />
              {tags && tags.length > 0 && (
                <>
                  <span className="px-4">{` • `}</span>
                  <span>
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
