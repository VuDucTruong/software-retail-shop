"use client"

import { useState } from "react"
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const options = [
  { id: 1, label: "React" },
  { id: 2, label: "Vue" },
  { id: 3, label: "Svelte" },
  { id: 4, label: "Angular" }
]

export default function ComboBoxMultiArray() {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<null | { id: number, label: string }>(null);
  const [selectedList, setSelectedList] = useState<{ id: number, label: string }[]>([]);

  const handleSelect = (item: { id: number, label: string }) => {
    // Kiểm tra trùng ID
    if (!selectedList.some(existing => existing.id === item.id)) {
      setSelectedList(prev => [...prev, item]);
    }
    setSelectedItem(item);
    setOpen(false);
  };

  const handleRemove = (id: number) => {
    setSelectedList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4 w-72">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Select Categories
          </Button>
        </PopoverTrigger>
        <PopoverContent className="px-0">
          <Command>
            <CommandInput  placeholder="Search..." />
            <CommandGroup>
              {options.map(item => (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => handleSelect(item)}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Danh sách item đã chọn + nút xóa */}
      <div className="flex flex-wrap gap-2">
        {selectedList.length === 0 && (
          <p className="text-sm text-muted-foreground">Chưa có item nào được chọn.</p>
        )}
        {selectedList.map(item => (
          <Badge
            key={item.id}
            variant="secondary"
            className="flex items-center text-[14px] font-normal"
          >
            {item.label}
            <Button
              variant="ghost"
              type="button"
              onClick={() => handleRemove(item.id)}
              className=" hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
