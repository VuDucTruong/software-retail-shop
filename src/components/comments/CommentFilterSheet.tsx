import { useCommentStore } from "@/stores/comment.store";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Switch } from "../ui/switch";

const FormSchema = z.object({
  search: z.string().optional(),
  productName: z.string().optional(),
  deleted: z.boolean().optional(),
});

export default function CommentFilterSheet() {
  const t = useTranslations();
  const getComments = useCommentStore((state) => state.getComments);
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      search: "",
        productName: "",
        deleted: false,
    },
  });

  function handleSubmit(data: z.infer<typeof FormSchema>) {

    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    );
    
    console.log(cleanedData);

    getComments({
      pageRequest: {
        page: 0,
        size: 10,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
      ...cleanedData,
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-fit">
          <Filter /> {t('search_and_filter' , { x: t("comment") })}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('search_and_filter' , { x: t("comment") })}</SheetTitle>
          <SheetDescription>
            {t('search_and_filter_description' , { x: t("comment") })}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto ">
          <Form {...form}>
            <form className=" w-full px-3 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Search")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Product")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deleted"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t('Status')}</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="deleted"
                        />
                        <Label htmlFor="deleted">{form.watch('deleted') ? t('Deleted') : t('not_deleted')}</Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="absolute right-0 left-0 bottom-2 flex gap-2 mx-3 bg-white pt-2">
            <Button
              className="flex-1"
              onClick={form.handleSubmit(handleSubmit)}
            >
              {t("apply_filters")}
            </Button>

            <Button
              className="flex-1"
              variant={"destructive"}
              onClick={() => {
                form.reset();
              }}
            >
              {t("reset_filters")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
