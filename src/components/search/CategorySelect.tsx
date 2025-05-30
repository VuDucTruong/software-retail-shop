import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTagStore } from "@/stores/product.tag.store";
import { useClientCommentStore } from "@/stores/cilent/client.comment.store";
import { useClientCategoryState } from "@/stores/cilent/client.category.store";
import { useShallow } from "zustand/shallow";
import { Skeleton } from "../ui/skeleton";


type TagSelectProps = {
    onChange?: (value: number) => void;
    value?: number;
}

export default function CategorySelect(props: TagSelectProps) {
    const { onChange, value } = props;
  const [categories, getCategories] = useClientCategoryState(useShallow((state) => [
    state.categories,
    state.getCategories,
  ]));

  useEffect(() => {
    getCategories({
        pageRequest: {
            page: 0,
            size: 100,
            sortBy: "createdAt",
            sortDirection: "desc",
        },
    });
  }, []);

  if(categories === null) {
    return <Skeleton className="w-[180px] h-9" />;
  }

  return (
    <Select value={value?.toString()} onValueChange={(val) => {
        onChange?.(Number(val));
    }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="-1">Tất cả</SelectItem>
        {categories?.data?.map((tag) => (
          <SelectItem key={tag.id} value={tag.id.toString()}>
            {tag.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
