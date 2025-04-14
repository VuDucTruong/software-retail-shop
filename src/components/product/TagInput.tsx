"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFormContext, Controller } from "react-hook-form"
import { Badge } from "../ui/badge"
import { X } from "lucide-react"

export function TagsInput() {
  const { control } = useFormContext()
  const [inputValue, setInputValue] = useState("")

  return (
    <Controller
      name="tags"
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập tag và nhấn Enter"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim() !== "") {
                  e.preventDefault()
                  if (!field.value.includes(inputValue.trim())) {
                    field.onChange([...field.value, inputValue.trim()])
                    setInputValue("")
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (inputValue.trim() !== "" && !field.value.includes(inputValue.trim())) {
                  field.onChange([...field.value, inputValue.trim()])
                  setInputValue("")
                }
              }}
            >
              Thêm
            </Button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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
                  field.onChange(field.value.filter((_: string, i: number) => i !== index))
                }}
                className=" hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
            ))}
          </div>
        </div>
      )}
    />
  )
}
