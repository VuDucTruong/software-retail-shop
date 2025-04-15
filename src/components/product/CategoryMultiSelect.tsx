import { Controller, useFormContext } from "react-hook-form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

// fake options - replace with real API categories
const options = [
  { id: 1, name: "React" },
  { id: 2, name: "Vue" },
  { id: 3, name: "Svelte" },
  { id: 4, name: "Angular" },
];

export function CategoryMultiSelectField() {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name="categories"
      defaultValue={[]}
      render={({ field }) => {
        const selectedIds = field.value || [];

        const handleSelect = (id: number) => {
          if (!selectedIds.includes(id)) {
            field.onChange([...selectedIds, id]);
          }
          setOpen(false);
        };

        const handleRemove = (id: number) => {
          field.onChange(selectedIds.filter((itemId: number) => itemId !== id));
        };

        return (
          <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedIds.length > 0
                    ? `Selected: ${selectedIds.length}`
                    : "Select Categories"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full px-0">
                <Command>
                  <CommandInput placeholder="Search category..." />
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

            <div className="flex flex-wrap gap-2">
              {selectedIds.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No category selected
                </p>
              )}
              {selectedIds.map((id: number) => {
                const category = options.find((opt) => opt.id === id);
                return category ? (
                  <Button
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {category.name}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemove(id)}
                      className="w-4 h-4 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Button>
                ) : null;
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
