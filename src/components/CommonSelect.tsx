import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type CommonSelectProps = {
    data: string[];
    defaultValue: string;
}

export function CommonSelect({ data, defaultValue }: CommonSelectProps) {
  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger className="w-fit border-none shadow-none focus-visible:ring-0">
        <SelectValue placeholder={defaultValue}/>
      </SelectTrigger>
      <SelectContent >
        <SelectGroup>
          {
            data.map((value, index) => (
              <SelectItem key={index} value={value}>
                {value}
              </SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
