import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTagStore } from "@/stores/product.tag.store";
import { useShallow } from "zustand/shallow";
import { Skeleton } from "../ui/skeleton";


type TagSelectProps = {
    onChange?: (value: string) => void;
    value?: string;
}

export default function TagSelect(props: TagSelectProps) {
    const { onChange, value } = props;
  const [tags, getTags] = useTagStore(useShallow((state) => [
    state.tags,
    state.getProductTags,
  ]));

  useEffect(() => {
    getTags();
  }, []);


  if(tags === null) {
    return <Skeleton className="w-[180px] h-9" />;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Tags" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả</SelectItem>
        {tags?.map((tag) => (
          <SelectItem key={tag} value={tag}>
            {tag}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
