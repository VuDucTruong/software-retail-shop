import React, { useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useShallow } from "zustand/shallow";
import { Button } from "../ui/button";
import { ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { GenreDomain } from "@/stores/blog/genre.store";
import { HashSet, } from "@/lib/utils";
import { BlogFormType } from "@/components/blog/BlogForm";

type Props = {
    field?: ControllerRenderProps<GenreDropDownUI.RegisteredType, 'selectedGenres'>; // or explicitly: ControllerRenderProps<FormValues, "genres">
    onGenre2Selected: (checked: boolean, genre2: GenreDropDownUI.Genre2Child[]) => void,
};

export namespace GenreDropDownUI {
    export namespace Genre {
        const SchemaBase = z.object({
            id: z.number(), name: z.string()
        })
        export const SchemaChild = SchemaBase.extend({
            parentGenre: SchemaBase // the parent guaranteed
        })
        export const SchemaParent = SchemaBase.extend({
            genres: z.array(SchemaChild)
        })
    }

    export type RegisteredType = BlogFormType
    export const RequiredSchema = z.object({
        selectedGenres: z.array(Genre.SchemaChild)
    })
    export type Genre1Parent = z.infer<typeof Genre.SchemaParent>
    export type Genre2Child = z.infer<typeof Genre.SchemaChild>
}

export default function GenreDropdown({ field, onGenre2Selected }: Props) {
    const [proxyLoading, genre1s, getGenre1s] = GenreDomain.useStore(useShallow(s => [
        s.proxyLoading, s.genre1s, s.getGenre1s
    ]))

    useEffect(() => {
        proxyLoading(getGenre1s,)
    }, [getGenre1s, proxyLoading]);


    /// THIS TO RENDER
    const genres: GenreDropDownUI.Genre1Parent[] = genre1s.map(g1 => ({
        ...g1,
        genres: g1.genre2s.map(g2 => ({ ...g2, parentGenre: { id: g1.id, name: g1.name } }))
    }))

    /// THIS GONNA BE BOUND TO FIELD

    if (!field) return null;
    const selectedGenres = field.value || [];

    const isChecked = (coming: GenreDropDownUI.Genre2Child[]) => {
        return coming.every(c => selectedGenres.some(s => s.id === c.id));
    }

    const handleCheckboxChange = (
        checked: boolean,
        genre: GenreDropDownUI.Genre2Child | GenreDropDownUI.Genre1Parent
    ) => {
        if (!field) return;

        let newSelected: typeof selectedGenres;

        if ('genres' in genre) {
            if (checked) {
                newSelected = HashSet.addAllReturnNew(selectedGenres, genre.genres, v => v.id);
            } else {
                const idsToRemove = new Set(genre.genres.map(g => g.id));
                newSelected = selectedGenres.filter(g => !idsToRemove.has(g.id));
            }
            onGenre2Selected(checked, genre.genres)
        } else {
            if (checked) {
                newSelected = HashSet.add(selectedGenres, genre, g => g.id);
            } else {
                newSelected = selectedGenres.filter(g => g.id !== genre.id);
            }
            onGenre2Selected(checked, [genre])

        }
        console.log('indropdown:', field.value)

        field.onChange(newSelected);
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
                    {genres.map((genre1) => {
                        return (
                            <DropdownMenuGroup key={genre1.id}>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <DropdownMenuCheckboxItem
                                            checked={isChecked(genre1.genres)}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange(checked, genre1)
                                            }>
                                            {genre1.name}
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            {genre1.genres.map((genre2) => (
                                                <DropdownMenuCheckboxItem
                                                    key={genre2.id}
                                                    checked={isChecked([genre2])}
                                                    onCheckedChange={(checked) =>
                                                        handleCheckboxChange(checked, genre2)
                                                    }>
                                                    {`${genre2.name}`}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="text-sm text-muted-foreground">
                Đã chọn:{" "}
                <span className="font-medium">{selectedGenres.map(g2 => g2.name).join(", ")}</span>
            </div>
        </div>
    );
}
