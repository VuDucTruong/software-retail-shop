"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import debounce from "lodash/debounce";
import {cn} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {CgDetailsMore} from "react-icons/cg";
import {SearchInput} from "@/components/blog/search/SearchInput";

type IDType = string | number;
type IDMultiType = IDType | IDType[];

type SearchWithDropDownProps<IId extends IDType | IDType[]> = {
  menus: {
    className?: string;
    items: { id: IId extends (infer U)[] ? U : IId; name: string; }[];
    selectedId?: IDType,
    enableAllId?: IDType,
    selectedIds?: IDMultiType,
    multiple?: boolean;
  };
  search: {
    className?: string;
  };
  onDebounced: (selected: IId, search: string) => void;
};


export function SearchWithDropDown<IId extends IDMultiType>({
                                                              menus, search, onDebounced,
                                                            }: SearchWithDropDownProps<IId>) {
  const [selected, setSelected] = useState<IId>(
    menus.multiple ? (menus.selectedIds as unknown as IId) : (menus.selectedId as unknown as IId)
  );
  const [searchText, setSearchText] = useState("");

  // Debounced sync
  const trigger = useMemo(
    () =>
      debounce((sel: IId, search: string) => {
        onDebounced(sel, search);
      }, 500),
    [onDebounced]
  );

  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    trigger(selected, searchText);
    return () => trigger.cancel();
  }, [selected, searchText]);

  const isSelected = useCallback(
    (id: IDType) =>
      menus.multiple
        ? (selected as IDType[]).includes(id)
        : selected === id,
    [selected, menus.multiple]
  );

  const enableAllId = menus.enableAllId;

  const toggleSelect = (id: IDType, checked: boolean = true) => {
    if (menus.multiple) {
      setSelected((prev) =>
        checked
          ? ([...(prev as IDType[]), id] as IId)
          : (prev as IDType[]).filter((i) => i !== id
            || (typeof enableAllId !== 'undefined' && i === enableAllId)) as IId
      );
    } else {
      setSelected(id as IId);
    }
  };

  const toggleSelectMany = (ids: IDMultiType, checked: boolean = true) => {
    if (!menus.multiple)
      return;
    if (checked)
      setSelected(ids as IId)
    else
      setSelected([] as unknown as IId)
  };

  const onChecked = ({id, checked, enableAll,}: {
    id: IId extends (infer U)[] ? U : IId,
    checked: boolean,
    enableAll?: boolean,
  }) => {
    if (enableAll) {
      toggleSelectMany(menus.items.map(item => item.id), checked)
    } else {
      toggleSelect(id, checked);
    }
  }

  const displayText = menus.multiple
    ? menus.items
    .filter((i) => (selected as IDType[]).includes(i.id))
    .map((i) => i.name)
    .join(", ") || "Select"
    : menus.items.find((i) => i.id === selected)?.name || "Select";

  return (
    <div className="flex items-center gap-3 w-full max-w-2xl">
      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-11 w-[160px] justify-start rounded-xl border-input border text-sm text-muted-foreground hover:text-foreground transition px-4",
              menus.className
            )}>
            <CgDetailsMore className="mr-2 text-base"/>
            <span className="truncate">{displayText}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[160px] max-h-[250px] overflow-y-auto">
          {menus.items.map((item) => {
            const selectedState = isSelected(item.id);
            return menus.multiple ? (
              <DropdownMenuCheckboxItem
                key={`${item.id}`}
                checked={selectedState}
                onCheckedChange={(checked) => onChecked({
                  id: item.id, checked,
                  enableAll: item.id === enableAllId,
                })}
                className={cn(
                  "cursor-pointer",
                  selectedState && "bg-accent text-accent-foreground"
                )}
              >
                {item.name}
              </DropdownMenuCheckboxItem>
            ) : (
              <DropdownMenuItem
                key={`${item.id}`}
                onSelect={(e) => {
                  e.preventDefault();
                  toggleSelect(item.id);
                }}
                className={cn(
                  "cursor-pointer",
                  selectedState && "bg-accent text-accent-foreground"
                )}
              >
                {item.name}
              </DropdownMenuItem>
            );
          })}

        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search */}
      <SearchInput
        onSearchChange={(q) => setSearchText(q)}
        className={cn("flex-1", search.className)}
      />
    </div>
  );
}