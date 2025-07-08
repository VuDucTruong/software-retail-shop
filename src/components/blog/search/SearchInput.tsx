"use client";

import {Input} from "@/components/ui/input";
import {Search, X} from "lucide-react";
import {useState} from "react";
import {cn} from "@/lib/utils";

type Props = {
    onSearchChange?: (value: string) => void;
    className?: string;
};


export const SearchInput = ({onSearchChange,  className}: Props) => {
    const [value, setValue] = useState("");

    const onValueChange = (current: string) => {
        setValue(current)
        if (onSearchChange)
            onSearchChange(current)
    }

    const onClearClicked =()=>{
        setValue("")
        if (onSearchChange)
            onSearchChange('')
    }

    return (
        <div className={cn("relative w-full max-w-[500px]", className)}>
            <Search className="absolute left-3 inset-y-0 my-auto text-muted-foreground w-5 h-5 pointer-events-none"/>
            {value && (
                <button
                    onClick={onClearClicked}
                    className="absolute right-2 inset-y-0 my-auto text-muted-foreground hover:text-foreground transition"
                >
                    <X className="w-4 h-4"/>
                </button>
            )}
            <Input
                type="text"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder="Search..."
                className={cn(
                    "pl-10 pr-8 h-11 rounded-xl",
                    "transition-all duration-300",
                    "focus-visible:ring-1 ring-ring"
                )}
            />
        </div>
    );
};
