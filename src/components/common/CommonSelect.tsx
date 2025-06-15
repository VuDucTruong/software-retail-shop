
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

type CommonSelectProps = {
    data: string[];
    defaultValue: string;
    onChange?: (value: string) => void;
}

export function CommonSelect({ data, defaultValue,onChange }: CommonSelectProps) {

  const t = useTranslations();

  return (
    <Select defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger className="w-fit border-none shadow-none focus-visible:ring-0">
        <SelectValue placeholder={defaultValue}/>
      </SelectTrigger>
      <SelectContent >
        <SelectGroup>
          {
            data.map((item, index) => (
              <SelectItem key={index} value={item}>
                {t(item)}	
              </SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
