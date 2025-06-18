"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import RichTextEditor from "../rich_text/RichTextEditor";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "../ui/form";
import { RichTextViewer } from "../rich_text/RichTextViewer";


type Props = {
  name: string;
  hint: string;
};

export default function ProductDescriptionInput(props: Props) {
  const { name,hint } = props;
  const { control,getValues,setValue,watch } = useFormContext();
  const handleClearText = () =>{
    const currentValue = getValues(name);
    if (currentValue) {
      setValue(name, "");
    }
    
  }
  return (
        <div
          className="border p-4 rounded-xl shadow-sm space-y-2"
        >
          <div className="flex justify-between items-center">
           <div className="text-sm text-muted-foreground italic max-w-lg break-words">
              {hint}
           </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleClearText}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <FormField
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RichTextEditor
                    content={getValues(name) || ""}
                    onChange={(content) => {
                      field.onChange(content);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <RichTextViewer content={watch(name)}/>
        </div>



  );
}
