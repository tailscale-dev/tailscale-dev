import { toLocaleUTCDateString } from '@/lib/utils/date';

export function DateDisplay({ dateString }) {
  if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
    const d = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    // display the time in UTC to avoid using the browser's
    // timezone, resulting in a hydration error
    const formattedDate = toLocaleUTCDateString(d, undefined, options);

    return <time dateTime={dateString}>{formattedDate}</time>;
  }

  return <time dateTime={dateString}>{dateString}</time>;
}
