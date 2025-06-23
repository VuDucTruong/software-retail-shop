import {useCategoryStore} from "@/stores/category.store";
import {zodResolver} from "@hookform/resolvers/zod";
import {Filter} from "lucide-react";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {Input} from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CommonInputOutline from "@/components/common/CommonInputOutline";
import {SwitchToggleField} from "@/components/ui/CommonYesNo";

export default function CategoryFilterSheet() {
  const t = useTranslations();
  const getCategories = useCategoryStore((state) => state.getCategories);
  const FormSchema = z.object({
    search: z.string().optional(),
    deleted: z.boolean(),

  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
      deleted: false
    },
  });

  function handleSubmit(data: z.infer<typeof FormSchema>) {


    getCategories({
      pageRequest: {
        page: 0,
        size: 10,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
      ...data, // thêm các trường không rỗng
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-fit">
          <Filter/> {t("search_and_filter", {x: t("category")})}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("search_and_filter", {x: t("category")})}</SheetTitle>
          <SheetDescription>
            {t("search_and_filter_description", {x: t("category")})}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto ">
          <Form {...form}>
            <form className=" w-full px-3 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="search"
                render={({field}) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("Search")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <CommonInputOutline title={t("include_deleted_item")}>
                <SwitchToggleField name="deleted"/>
              </CommonInputOutline>
            </form>
          </Form>
          <div className="absolute right-0 left-0 bottom-2 flex gap-2 mx-3 bg-white pt-2">
            <Button
              className="flex-1"
              onClick={form.handleSubmit(handleSubmit)}
            >
              {t("Apply")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
