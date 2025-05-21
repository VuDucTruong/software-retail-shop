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
import { isoToDatetimeLocal } from "@/lib/date_helper";
import { useBlogStore } from "@/stores/blog.store";

export default function BlogFilterSheet() {
  const t = useTranslations();
  const getBlogs = useBlogStore((state) => state.getBlogs);
  const FormSchema = z.object({
    search: z.string().optional(),
    genres: z.array(z.string()).optional(),
    publishedFrom: z.string().optional(),
    publishedTo: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
      genres: [],
      publishedFrom: isoToDatetimeLocal(new Date().toISOString()),
      publishedTo: ""
    },
  });

  function handleSubmit(data: z.infer<typeof FormSchema>) {
    getBlogs({
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
          <Filter /> Lọc & Tìm kiếm bài viết
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Lọc & Tìm kiếm bài viếtc</SheetTitle>
          <SheetDescription>
            Hỗ trợ tìm kiếm bài viết dựa trên tiêu đề , lọc theo thể loại, ngày phát hành
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto ">
          <Form {...form}>
            <form className=" w-full px-3 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                name="genres"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                name="publishedFrom"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tìm kiếm</FormLabel>
                    <FormControl>
                      <Input type="datetime-local"  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publishedTo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tìm kiếm</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" min={form.watch('publishedFrom')} {...field} />
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
