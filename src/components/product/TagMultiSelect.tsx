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
import { useTagStore } from "@/stores/product.tag.store";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  ControllerRenderProps
} from "react-hook-form";
import { useShallow } from "zustand/shallow";
import { Skeleton } from "../ui/skeleton";



export function TagMultiSelectField({
  field,
}: {
  field: ControllerRenderProps<any,any>;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const [getTags , tags] = useTagStore(useShallow((state) => [state.getProductTags, state.tags]));


  useEffect(() => {
   getTags()
  },[getTags])

  const options = tags ?? [];

  const selectedTags = field.value || [];

  const handleSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      field.onChange([...selectedTags, tag]);
    }
    setOpen(false);
  };

  const handleRemove = (deletedTag: string) => {
    field.onChange(selectedTags.filter((tag: string) => tag !== deletedTag));
  };
  return (
    <div className="space-y-2">
      <Popover modal open={open} onOpenChange={setOpen}>
        {
          tags === null ? (
            <PopoverTrigger disabled>
              <Skeleton className="w-full h-10" />
            </PopoverTrigger>
          ) : (
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedTags.length > 0
                  ? `${t('Selected')}: ${selectedTags.length}`
                  : t("select_tags")}
              </Button>
            </PopoverTrigger>
          )
        }
        <PopoverContent className="flex px-0" align="start">
          <Command>
            <CommandInput placeholder={t('search_tags')} />
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => handleSelect(item)}
                >
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedTags.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t("no_tags_selected")}
          </p>
        )}
        {selectedTags.map((id: string) => {
          const tag = options.find((item) => item === id);
          return tag ? (
            <Badge
              key={id}
              variant="secondary"
              className="flex items-center text-[14px] font-normal"
            >
              {tag}
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
