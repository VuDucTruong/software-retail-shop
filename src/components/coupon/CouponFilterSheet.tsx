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
import CouponTypeSelect from "./CouponTypeSelect";
import { useCouponStore } from "@/stores/coupon.store";

const FormSchema = z
  .object({
    search: z.string().optional(),
    type: z.enum(["PERCENTAGE", "FIXED", "ALL"]).optional(),
    availableFrom: z.string().optional(),
    availableTo: z.string().optional(),
    valueFrom: z.preprocess((val) => {
      if(val) return Number(val);
      return val
    }, z.number().optional()),
    valueTo: z.preprocess((val) => {
      if(val) return Number(val);
      return val
    }, z.number().optional()),
  })

export default function CouponFilterSheet() {
  const t = useTranslations();
  const getCoupons = useCouponStore(
    (state) => state.getCoupons );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
      type: undefined,
      availableFrom: "",
      availableTo: "",
      valueFrom: undefined,
      valueTo: undefined,
    },
  });

  function handleSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== ""  && value !== "ALL"
      )
    );

    getCoupons({
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
          <Filter /> Lọc & Tìm kiếm mã giảm giá
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Lọc & Tìm kiếm mã giảm giá</SheetTitle>
          <SheetDescription>
            Hỗ trợ tìm kiếm mã giảm giá, lọc theo khoảng giá trị, thời gian và
            loại mã giảm giá
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại mã giảm giá</FormLabel>
                    <FormControl>
                      <CouponTypeSelect
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Từ ngày</FormLabel>
                    <FormControl>
                      <Input type="date"  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đến ngày</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="Đến ngày" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valueFrom"
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
                name="valueTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đến giá trị</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Giá trị đến" {...field} />
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
