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
  required,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <FormItem className={` border-l-3 border-border pl-3 ${className}`}>
      <FormLabel>{title} <span className="text-red-500">{required && "*"}</span></FormLabel>
      <FormMessage />
      <FormControl>{children}</FormControl>
      
    </FormItem>
  );
}
