import { useLocale } from "next-intl";


export const getCurrentMY = () => {
    const locale = useLocale();
    const date = new Date();
    return new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric'
      }).format(date);
}