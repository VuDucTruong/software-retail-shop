import { Control } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "./ui/form";

export default function CommonInputOutline({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <FormItem className={`${className}`}>
      <FormLabel>{title}</FormLabel>
      <FormMessage />
      <FormControl>{children}</FormControl>
      
    </FormItem>
  );
}
