import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenreDomain } from "@/stores/blog/genre.store";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { ControllerRenderProps, FieldPath } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/shallow";
import { Button } from "../ui/button";

type Props<T extends { selectedGenre2Ids: Set<number> }> = {
  field?: ControllerRenderProps<T, FieldPath<T> & "selectedGenre2Ids">;
  onGenre2Selected?: (genre2: Set<number>) => void;
};
export namespace Internal {
  export namespace Genre {
    const SchemaBase = z.object({
      id: z.number(),
      name: z.string(),
    });
    export const SchemaChild = SchemaBase.extend({
      parentGenre: SchemaBase, // the parent guaranteed
    });
    export const SchemaParent = SchemaBase.extend({
      genres: z.array(SchemaChild),
    });
  }

  export type RegisteredType = { selectedGenre2Ids: Set<number> };

  export type Genre1Parent = z.infer<typeof Genre.SchemaParent>;
  export type Genre2Child = z.infer<typeof Genre.SchemaChild>;
}
export const RequiredSchema = z.object({
  selectedGenre2Ids: z.set(z.number()),
});

export default function GenreDropdown<T extends Internal.RegisteredType>({
  field,
  onGenre2Selected,
}: Props<T>) {
  const [proxyLoading, genre1s, getGenre1s] = GenreDomain.useStore(
    useShallow((s) => [s.proxyLoading, s.genre1s, s.getGenre1s])
  );
  const t = useTranslations();

  useEffect(() => {
    proxyLoading(getGenre1s);
  }, []);

  useEffect(() => {
    if (!field) return;
    if (onGenre2Selected) onGenre2Selected(field.value || new Set<number>());
  }, [field]);

  /// THIS TO RENDER
  const genres: Internal.Genre1Parent[] = genre1s.map((g1) => ({
    id: g1.id,
    name: g1.name,
    genres: g1.genre2s.map((g2) => ({
      ...g2,
      parentGenre: { id: g1.id, name: g1.name },
    })),
  }));

  /// THIS GONNA BE BOUND TO FIELD
  if (!field) return null;
  const selectedGenres = new Set<number>(field?.value ?? []);

  const isChecked = (coming: Internal.Genre2Child[]) => {
    return coming.every((c) => selectedGenres.has(c.id));
  };

  const handleCheckboxChange = (
    checked: boolean,
    genre: Internal.Genre2Child | Internal.Genre1Parent
  ) => {
    if (!field) return;

    let newSelected: typeof selectedGenres;

    if ("genres" in genre) {
      if (checked) {
        newSelected = new Set<number>([
          ...selectedGenres,
          ...genre.genres.map((g2) => g2.id),
        ]);
      } else {
        const idsToRemove = new Set(genre.genres.map((g) => g.id));
        newSelected = new Set<number>(
          [...selectedGenres].filter((g2Id) => idsToRemove.has(g2Id))
        );
      }
    } else {
      if (checked) {
        newSelected = selectedGenres.add(genre.id);
      } else {
        selectedGenres.delete(genre.id);
        newSelected = new Set(selectedGenres);
      }
    }

    field.onChange(newSelected);
  };

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
                <DropdownMenuTrigger className="max-w-[200px]" asChild>
                    <Button variant="outline" className="w-full justify-between">
                        {t("select_genre")}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]" >
                    {genres.map((genre1) => {
                        return (
                            <DropdownMenuGroup key={genre1.id}>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <DropdownMenuCheckboxItem
                                            checked={isChecked(genre1.genres)}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange(checked, genre1)
                                            }
                                        >
                                            {genre1.name}
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className={genre1.genres.length > 0 ? "" : "hidden"}>
                                            {genre1.genres.map((genre2) => (
                                                <DropdownMenuCheckboxItem
                                                    key={genre2.id}
                                                    checked={isChecked([genre2])}
                                                    onCheckedChange={(checked) =>
                                                        handleCheckboxChange(checked, genre2)
                                                    }
                                                >
                                                    {`${genre2.name}`}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

      <div className="text-sm text-muted-foreground">
        {t("Selected")}:{" "}
        <span className="font-medium">{[...selectedGenres].join(", ")}</span>
      </div>
    </div>
  );
}
