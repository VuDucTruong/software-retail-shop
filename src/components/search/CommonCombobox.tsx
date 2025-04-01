"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

type CommonComboboxProps = {
  data: string[];
  field: any;
  form: any;
  name: string;
  title: string;
  placeholder?: string;
  emptyString?: string;
};

export function CommonCombobox(props: CommonComboboxProps) {
  const { data, field, form,name,emptyString,placeholder,title } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-[200px] justify-between",
            !field.value && "text-muted-foreground"
          )}
        >
          {field.value
            ? data.find((item) => item === field.value)
            : title}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyString}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  value={item}
                  key={item}
                  onSelect={() => {
                    form.setValue(name, item);
                  }}
                >
                  {item}
                  <Check
                    className={cn(
                      "ml-auto",
                      item=== field.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
