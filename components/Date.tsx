import { formatDate } from '../lib/utils/formatDate';

export function Date({ date }: { date: string }) {
  return <time dateTime={date}>{formatDate(date)}</time>;
}
