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
import { useProductStore } from "@/stores/product.store";
import { CategoryMultiSelectField } from "./CategoryMultiSelect";
import { TagsInput } from "./TagInput";
import { TagMultiSelectField } from "./TagMultiSelect";

const FormSchema = z.object({
  search: z.string().optional(),
  priceFrom: z.string().optional(),
  priceTo: z.string().optional(),
  categoryIds: z.number().array().optional(),
  tags: z.string().array().optional(),
});

export default function ProductFilterSheet() {
  const t = useTranslations();
  const getProducts = useProductStore((state) => state.getProducts);
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      search: "",
      priceFrom: "",
      priceTo: "",
      categoryIds: [],
      tags: [],
    },
  });

  function handleSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== ""
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
          <Filter /> Lọc & Tìm kiếm sản phẩm
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Lọc & Tìm kiếm sản phẩm</SheetTitle>
          <SheetDescription>
            Hỗ trợ tìm kiếm sản phẩm, lọc theo khoảng giá trị, danh mục sản phẩm
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
                    <FormLabel>Tìm kiếm</FormLabel>
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
                    <FormLabel>Giá trị từ</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Giá trị từ"
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
                    <FormLabel>Đến giá trị</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Giá trị đến"
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
                    <FormLabel>Chọn các danh mục</FormLabel>
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
                    <FormLabel>Chọn các thẻ sản phẩm</FormLabel>
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
              Lọc và tìm kiếm
            </Button>

            <Button
              className="flex-1"
              variant={"destructive"}
              onClick={() => {
                form.reset();
              }}
            >
              Đặt lại
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
