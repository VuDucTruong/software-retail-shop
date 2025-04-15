"use client";

import { useFormContext, Controller, ControllerRenderProps } from "react-hook-form";
import { ProductCreate, ProductUpdate } from "@/types/api/product"; // adjust path
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Key, useState } from "react";
import { useTranslations } from "next-intl";

// replace options by actural categories from API
const options = [
  { id: 1, name: "React", description: "Frontend library" },
  { id: 2, name: "Vue", description: "Progressive framework" },
  { id: 3, name: "Svelte", description: "Compiler-based framework" },
  { id: 4, name: "Angular", description: "Full-featured framework" },
];

export default function CategoryMultiSelect() {
  const { setValue, watch } = useFormContext<
    ProductCreate | ProductUpdate
  >();
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  // Watch the category ids from form state
  const selectedIds = watch("categories") || [];

  const handleSelect = (id: number) => {
    if (!selectedIds.includes(id)) {
     setValue("categories", [...selectedIds, id]);
    }
    setOpen(false);
  };

  const handleRemove = (id: number) => {
    const updated = selectedIds.filter((itemId: number) => itemId !== id);
    setValue("categories", updated);
  };

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedIds.length > 0
              ? "Selected: " + selectedIds.length
              : "Select Categories"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="px-0">
          <Command>
            <CommandInput placeholder={t("search_hint")} />
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => handleSelect(item.id)}
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display selected categories */}
      <div className="flex flex-wrap gap-2">
        {selectedIds.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t("no_selected_category")}
          </p>
        )}
        {selectedIds.map((id: number) => {
          const category = options.find((opt) => opt.id === id);
          return category ? (
            <Badge
              key={id}
              variant="secondary"
              className="flex items-center text-[14px] font-normal"
            >
              {category.name}
              <Button
                variant="ghost"
                type="button"
                onClick={() => handleRemove(id)}
                className="hover:text-red-500 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ) : null;
        })}
      </div>
    </div>
  );
}
