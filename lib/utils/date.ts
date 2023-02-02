export function toLocaleUTCDateString(date, locales, options) {
  const timeDiff = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.valueOf() + timeDiff);
  return adjustedDate.toLocaleDateString(locales, options);
}
