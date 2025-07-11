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
import CommonInputOutline from "@/components/common/CommonInputOutline";
import {CommonSwitch} from "@/components/common/CommonSwitch";

const FormSchema = z
  .object({
    search: z.string(),
    type: z.enum(["PERCENTAGE", "FIXED", "ALL"]),
    availableFrom: z.string(),
    availableTo: z.string(),
    deleted: z.boolean(),
    valueFrom: z.preprocess((val) => {
      if(val) return val;
      return val
    }, z.string()),
    valueTo: z.preprocess((val) => {
      if(val) return val;
      return val
    }, z.string()),
  }).partial()

export default function CouponFilterSheet() {
  const t = useTranslations();
  const getCoupons = useCouponStore(
    (state) => state.getCoupons );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
      type: "ALL",
      deleted: false,
      availableFrom: "",
      availableTo: "",
      valueFrom: "",
      valueTo: "",
    },
  });

  function handleSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== undefined && value !== ""  && value !== "ALL"
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
          <Filter /> {t("search_and_filter", { x: t("coupon") })}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("search_and_filter", { x: t("coupon") })}</SheetTitle>
          <SheetDescription>
            {t("search_and_filter_description", { x: t("coupon") })}
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

              <CommonInputOutline title={t("include_deleted_item")}>
                <CommonSwitch name="deleted" className="data-[state=checked]:bg-red-500"/>
              </CommonInputOutline>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("coupon_type")}</FormLabel>
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
                    <FormLabel>{t('available_from')}</FormLabel>
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
                    <FormLabel>{t('available_to')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>{t('value_from')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
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
                    <FormLabel>{t('value_to')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
