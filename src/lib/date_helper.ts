import { useLocale } from "next-intl";


export const getCurrentMY = () => {
    const locale = useLocale();
    const date = new Date();
    return new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric'
      }).format(date);
}


export const isoToDatetimeLocal = (iso: string): string => {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000); // convert to local time
  return localDate.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
};