import { vi } from "date-fns/locale";
import { Locale } from "next-intl";



export const getCurrentMY = (locale: Locale) => {

    const date = new Date();
    return new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric'
      }).format(date);
}

export const getStatisticDate = (locale: Locale, date?: string) => {
    const d = date ? new Date(date) : new Date();
    return new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: '2-digit',
      }).format(d);
}


export const getDateTimeLocal = (value?: string): string => {
  const date = value ? new Date(value) : new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000); // convert to local time
  return localDate.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
};

export const getDateLocal = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000); // convert to local time
  return localDate.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export const getDatePickerLocale = (locale: Locale) => {
  switch (locale) {
    case 'vi':
      return vi;
    default:
      return undefined; // Default locale for date-fns
  }
}