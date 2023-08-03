export function toLocaleUTCDateString(date, locales, options) {
  const timeDiff = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.valueOf() + timeDiff);
  return adjustedDate.toLocaleDateString(locales, options);
}

export function convertDateTimezone(input: Date, zone: string): Date {
  return new Date(Date.parse(input.toLocaleString('en-US', { timeZone: zone })));
}
