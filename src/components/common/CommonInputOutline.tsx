import { Control } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

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
    <FormItem className={` border-l-3 border-border pl-3 ${className}`}>
      <FormLabel>{title}</FormLabel>
      <FormMessage />
      <FormControl>{children}</FormControl>
      
    </FormItem>
  );
}
