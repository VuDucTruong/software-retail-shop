import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useCategoryStore } from "@/stores/category.store";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  ControllerRenderProps
} from "react-hook-form";
import { Skeleton } from "../ui/skeleton";



export function CategoryMultiSelectField({
  field,
}: {
  field: ControllerRenderProps<any,any>;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const getCategories = useCategoryStore(
    (state) => state.getCategories);
  const categories = useCategoryStore((state) => state.categories);
  const status = useCategoryStore((state) => state.status);


  useEffect(() => {
    getCategories({
      page: 0,
      limit: 100,
      sort: "name",
      order: "asc",
    });
  },[getCategories]);

  const options = categories?.data ?? [];

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
      <Popover modal open={open} onOpenChange={setOpen}>
        {
          status === "loading" ? (
            <PopoverTrigger disabled>
              <Skeleton className="w-full h-10" />
            </PopoverTrigger>
          ) : (
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedIds.length > 0
                  ? `Selected: ${selectedIds.length}`
                  : "Select Categories"}
              </Button>
            </PopoverTrigger>
          )
        }
        <PopoverContent className="flex px-0" align="start">
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
            {t("no_categories_selected")}
          </p>
        )}
        {selectedIds.map((id: number) => {
          const category = options.find((item) => item.id === id);
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
                onClick={() => {
                  handleRemove(id);
                }}
                className=" hover:text-red-500"
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
