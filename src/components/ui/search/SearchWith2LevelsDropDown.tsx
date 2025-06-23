"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CgDetailsMore } from "react-icons/cg";
import { SearchInput } from "@/components/ui/search/SearchInput";
import {useEffect, useMemo, useRef, useState} from "react";
import debounce from "lodash/debounce";
import { cn } from "@/lib/utils";

type IDType = string | number;

type TwoLevelItem = {
    id: IDType;
    name: string;
    children: {
        id: IDType;
        name: string;
    }[];
};

type Props = {
    menus: {
        className?: string;
        items: TwoLevelItem[];
    };
    search: {
        className?: string;
    };
    onDebounced: (selected: IDType[], search: string) => void;
};

export function SearchWith2LevelsDropdown({ menus, search, onDebounced }: Props) {
    const [selectedIds, setSelectedIds] = useState<IDType[]>([]);
    const [searchText, setSearchText] = useState("");

    const trigger = useMemo(
        () =>
            debounce((selected: IDType[], text: string) => {
                onDebounced(selected, text);
            }, 300),
        [onDebounced]
    );
    const didMount = useRef(false);

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        trigger(selectedIds, searchText);
        return () => trigger.cancel();
    }, [selectedIds, searchText, ]);

    const isChildChecked = (id: IDType) => selectedIds.includes(id);

    const isParentChecked = (children: { id: IDType }[]) =>
        children.every((c) => selectedIds.includes(c.id));

    const toggleChild = (id: IDType, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((x) => x !== id)
        );
    };

    const toggleParent = (children: { id: IDType }[], checked: boolean) => {
        setSelectedIds((prev) => {
            const childIds = children.map((c) => c.id);
            if (checked) {
                const newSet = new Set([...prev, ...childIds]);
                return Array.from(newSet);
            } else {
                return prev.filter((id) => !childIds.includes(id));
            }
        });
    };

    const displayText =
        menus.items
            .flatMap((g) =>
                g.children.filter((c) => selectedIds.includes(c.id)).map((c) => c.name)
            )
            .join(", ") || "Select";

    return (
        <div className="flex items-center gap-3 w-full max-w-2xl">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "h-11 w-[200px] justify-start rounded-xl border-input border text-sm text-muted-foreground hover:text-foreground transition px-4",
                            menus.className
                        )}
                    >
                        <CgDetailsMore className="mr-2 text-base" />
                        <span className="truncate">{displayText}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[200px] max-h-[300px] overflow-y-auto p-1">
                    {menus.items.map((group) => (
                        <DropdownMenuSub key={group.id}>
                            <DropdownMenuSubTrigger>
                                <DropdownMenuCheckboxItem
                                    checked={isParentChecked(group.children)}
                                    onCheckedChange={(checked) =>
                                        toggleParent(group.children, checked)
                                    }
                                >
                                    {group.name}
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {group.children.map((child) => (
                                        <DropdownMenuCheckboxItem
                                            key={child.id}
                                            checked={isChildChecked(child.id)}
                                            onCheckedChange={(checked) =>
                                                toggleChild(child.id, checked)
                                            }
                                        >
                                            {child.name}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <SearchInput
                onSearchChange={(q) => setSearchText(q)}
                className={cn("flex-1", search.className)}
            />
        </div>
    );
}
