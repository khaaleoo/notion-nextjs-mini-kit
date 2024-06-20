/**
 * Function to parse a date to a common readable string in English and Vietnamese
 * @param date - The date to be formatted
 * @param locale - The desired locale ('en' for English, 'vi' for Vietnamese)
 * @returns Formatted date string
 */
export const formatDateLocalized = (date: Date, locale: "en" | "vi" = "en"): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };

  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};
