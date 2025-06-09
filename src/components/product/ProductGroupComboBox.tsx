import { useProductGroupStore } from "@/stores/product.group.store";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Skeleton } from "../ui/skeleton";
import AddGroupDialog from "./AddGroupDialog";

export default function ProductGroupComboBox({
  field,
}: {
  field: ControllerRenderProps<any, string>;
}) {
  const t = useTranslations();
  const getProductGroups = useProductGroupStore(
    (state) => state.getProductGroups
  );
  const productGroups = useProductGroupStore((state) => state.productGroups);
  const status = useProductGroupStore((state) => state.status);
  useEffect(() => {
    getProductGroups();
  }, [getProductGroups]);

  const [open, setOpen] = React.useState(false);

  const options = productGroups ?? [];

  const selectedGroup = options.find((group) => group.id === field.value)?.name || t('select_product_group');


  return (
    <div className="flex flex-row-reverse gap-2">
      <AddGroupDialog />
      <Popover modal open={open} onOpenChange={setOpen}>
      {status === "loading" ? (
        <PopoverTrigger disabled>
          <Skeleton className="flex-1 h-10" />
        </PopoverTrigger>
      ) : (
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex-1 flex justify-start">
            {selectedGroup}
          </Button>
        </PopoverTrigger>
      )}

      <PopoverContent className="flex px-0" align="start">
        <Command>
          <CommandInput placeholder={t('Search', {x: t('product_group')})} />
          <CommandGroup>
            {
              options.length > 0 ? (
                options.map((group) => (
                  <CommandItem
                    key={group.id}
                    onSelect={() => {
                      field.onChange(group.id);
                      setOpen(false);
                    }}
                  >
                    {group.name}
                  </CommandItem>
                ))
              ) : (
                <div className="p-2 flex items-center justify-center italic text-sm">{t('no_products_found')}</div>
              )
            }
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
    </div>
  );
}
