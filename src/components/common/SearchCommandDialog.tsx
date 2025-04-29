"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { Search, FileText } from "lucide-react";
import { useState } from "react";
import React from "react";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function SearchCommandDialog() {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] items-center justify-start text-muted-foreground mr-6"
        >
          <Search className="mr-2 h-4 w-4" />
          Press{" "}
          <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium">
            <span className="text-sm">⌘ + K</span>
          </kbd>
        </Button>
      </DialogTrigger>
        
      <DialogContent className="p-0 overflow-hidden max-w-lg">
      <DialogTitle className="hidden"></DialogTitle>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Pages">
              <CommandItem onSelect={() => alert("Go to dashboard")}>
                <FileText className="mr-2 h-4 w-4" />
                Dashboard
              </CommandItem>
              <CommandItem onSelect={() => alert("Go to settings")}>
                <FileText className="mr-2 h-4 w-4" />
                Settings
              </CommandItem>
              <CommandItem onSelect={() => alert("Go to users")}>
                <FileText className="mr-2 h-4 w-4" />
                Users
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
