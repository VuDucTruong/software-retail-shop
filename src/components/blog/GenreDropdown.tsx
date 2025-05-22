import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { useBlogStore } from "@/stores/blog.store";
import { useShallow } from "zustand/shallow";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ControllerRenderProps } from "react-hook-form";

type Props = {
  field?: ControllerRenderProps<any, any>; // or explicitly: ControllerRenderProps<FormValues, "genres">
};

export default function GenreDropdown({ field }: Props) {
  const [genres, getGenres] = useBlogStore(
    useShallow((state) => [state.genres, state.getGenres])
  );

  useEffect(() => {
    getGenres();
  }, []);

  if (genres === null) {
    return <Skeleton className="max-w-[200px]" />;
  }

  const selectedGenres: string[] = field?.value ?? [];

  const isChecked = (genre: string) => selectedGenres.includes(genre);

  const handleCheckboxChange = (checked: boolean, genre: string) => {
    if (!field) return;

    const newValue = checked
      ? [...selectedGenres, genre]
      : selectedGenres.filter((g) => g !== genre);

    field.onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="max-w-[200px]" asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedGenres.length > 0 ? "Đã chọn" : "Chọn thể loại"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {genres.map((genre) => {
            if (!genre.genres || genre.genres.length === 0) {
              return (
                <DropdownMenuCheckboxItem
                  key={genre.id}
                  checked={isChecked(genre.name)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(checked, genre.name)
                  }
                >
                  {genre.name}
                </DropdownMenuCheckboxItem>
              );
            } else {
              return (
                <DropdownMenuGroup key={genre.id}>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <DropdownMenuCheckboxItem
                        checked={isChecked(genre.name)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(checked, genre.name)
                        }
                      >
                        {genre.name}
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {genre.genres.map((subGenre) => (
                          <DropdownMenuCheckboxItem
                            key={subGenre.id}
                            checked={isChecked(subGenre.name)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(checked, subGenre.name)
                            }
                          >
                            {subGenre.name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              );
            }
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="text-sm text-muted-foreground">
        Đã chọn:{" "}
        <span className="font-medium">{selectedGenres.join(", ")}</span>
      </div>
    </div>
  );
}
