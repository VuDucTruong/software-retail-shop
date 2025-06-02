import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import { useCategoryStore } from "@/stores/category.store";
import { useProductItemStore } from "@/stores/product.item.store";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export default function ProductItemFilterSheet() {
  const t = useTranslations();
  const getProductItems = useProductItemStore((state) => state.getProductItems);
  const FormSchema = z.object({
    productName: z.string().optional(),
    productKey: z.string().optional(),
    used: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      productName: "",
      productKey: "",
      used: false,
    },
  });

  function handleSubmit(data: z.infer<typeof FormSchema>) {
    getProductItems({
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
          <Filter /> {t("search_and_filter", { x: t("product_key") })}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("search_and_filter", { x: t("product_key") })}</SheetTitle>
          <SheetDescription>
            {t("search_and_filter_description", { x: t("product_key") })}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto ">
          <Form {...form}>
            <form className=" w-full px-3 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                name="productKey"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t('product_key')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="used"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("Status")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="status"
                        />
                        <Label htmlFor="status">{form.watch('used') ? t('Used') : t('Unused')}</Label>
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
              {t('apply_filters')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
