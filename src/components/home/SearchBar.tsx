import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
];

export default function SearchBar() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const navigateToSearchResults = () => {
    // Implement navigation to search results page

    router.push(
      "/search" +
        "?" +
        new URLSearchParams({
          category: selectedCategory,
          query: searchRef.current?.value || "",
        })
    );
  };
  return (
    <div className="flex items-center border border-primary rounded-md p-2 w-full max-w-md">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center text-sm focus-visible:ring-0 rounded-r-none font-medium border-r-2 "
          >
            {selectedCategory} <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {categories.map((category) => (
            <DropdownMenuItem
              key={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Input
        type="text"
        ref={searchRef}
        placeholder="Search for items..."
        className="flex-1 border-none focus-visible:ring-0 shadow-none"
      />
      <Button variant="ghost" className="p-2" onClick={navigateToSearchResults}>
        <Search className="w-5 h-5 text-gray-500" />
      </Button>
    </div>
  );
}
