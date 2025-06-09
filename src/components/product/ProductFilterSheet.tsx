import { useProductStore } from "@/stores/product.store";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
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
import { CategoryMultiSelectField } from "./CategoryMultiSelect";
import { TagMultiSelectField } from "./TagMultiSelect";

type ProductFilterForm = {
  search?: string;
  priceFrom?: string;
  priceTo?: string;
  categoryIds?: number[];
  tags?: string[];
}

export default function ProductFilterSheet() {
  const t = useTranslations();
  const getProducts = useProductStore((state) => state.getProducts);
  const form = useForm<ProductFilterForm>({
    defaultValues: {
      search: "",
      priceFrom: "",
      priceTo: "",
      categoryIds: [],
      tags: [],
    },
  });

  function handleSubmit(data: ProductFilterForm) {
    console.log(data);
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    );
    

    getProducts({
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
          <Filter /> {t('search_and_filter' , {x: t('products')})}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('search_and_filter' , {x: t('products')})}</SheetTitle>
          <SheetDescription>
            {t('search_and_filter_description' , {x: t('products')})}
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
                    <FormLabel>{t('Search')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Input.price_from_placeholder')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('Input.price_from_placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Input.price_to_placeholder')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('Input.price_to_placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Categories')}</FormLabel>
                    <FormControl>
                      <CategoryMultiSelectField field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Tags")}</FormLabel>
                    <FormControl>
                      <TagMultiSelectField field={field} />
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

            <Button
              className="flex-1"
              variant={"destructive"}
              onClick={() => {
                form.reset();
              }}
            >
              {t('reset_filters')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
