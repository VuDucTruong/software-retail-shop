import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { MdOutlineSend } from "react-icons/md";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

export default function ProductFilterSheet() {
  const t = useTranslations();

  const FormSchema = z.object({
    comment: z
      .string()
      .min(10, {
        message: t("Input.error_comment_min_length"),
      })
      .max(500, {
        message: t("Input.error_comment_max_length"),
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "",
    },
  });

  function handleSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    form.reset();
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-fit">
          <Filter /> Filter
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Product Filter</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full px-3 flex flex-col justify-between"
          >
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <h3>{t("Comment")}</h3>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 ">
            <Button className="not-italic mt-auto flex-1" type="submit">
              OK
            </Button>
            <Button variant={"destructive"} className="flex-1">
                {t("Cancel")}
            </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
