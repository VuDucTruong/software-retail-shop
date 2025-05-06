"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ControllerRenderProps } from "react-hook-form";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

export function TagsInput({
  field,
}: {
  field: ControllerRenderProps<any, string>;
}) {
  const [inputValue, setInputValue] = useState("");
  const t = useTranslations();
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim() !== "") {
              e.preventDefault();
              if (!field.value.includes(inputValue.trim())) {
                field.onChange([...field.value, inputValue.trim()]);
                setInputValue("");
              }
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (
              inputValue.trim() !== "" &&
              !field.value.includes(inputValue.trim())
            ) {
              field.onChange([...field.value, inputValue.trim()]);
              setInputValue("");
            }
          }}
        >
          {t("Add")}
        </Button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {field.value.length > 0 ? (
          <>
            {field.value.map((tag: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center text-[14px] font-normal"
              >
                {tag}
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    field.onChange(
                      field.value.filter((_: string, i: number) => i !== index)
                    );
                  }}
                  className=" hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{t('no_tags_selected')}</p>
        )}
      </div>
    </div>
  );
}
