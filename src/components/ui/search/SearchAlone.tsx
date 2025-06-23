"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import debounce from "lodash/debounce";
import {cn} from "@/lib/utils";
import {SearchInput} from "@/components/ui/search/SearchInput";


type SearchWithDropDownProps<> = {
    className?: string;
    onDebounced: (search: string) => void;
};

export function SearchAlone({className, onDebounced,}: SearchWithDropDownProps) {

    const [searchText, setSearchText] = useState("");

    // Debounced sync
    const trigger = useMemo(
        () =>
            debounce((search: string) => {
                onDebounced(search);
            }, 500),
        [onDebounced]
    );

    const didMount = useRef(false);

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        trigger(searchText);
        return () => trigger.cancel();
    }, [searchText]);

    return (
        <div className="flex items-center gap-3 w-full max-w-2xl">
            {/* Search */}
            <SearchInput
                onSearchChange={(q) => setSearchText(q)}
                className={cn("flex-1", className)}
            />
        </div>
    );
}