import { useUserStore } from "@/stores/user.store";
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
import CommonInputOutline from "@/components/common/CommonInputOutline";
import {CommonSwitch} from "@/components/common/CommonSwitch";


type UserFilterForm = {
  fullName?: string;
  deleted: boolean;
  email?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export default function UserFilterSheet() {
  const t = useTranslations();
  const getUsers = useUserStore(
    (state) => state.getUsers );
  const form = useForm<UserFilterForm>({
    defaultValues: {
      fullName: "",
      deleted: false,
      email: "",
      createdAtFrom: "",
      createdAtTo: "",
    },
  });


  function handleSubmit(data: UserFilterForm) {
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    );

    getUsers({
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
          <Filter /> {t('search_and_filter', { x: t("customer") })}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('search_and_filter', { x: t("customer") })}</SheetTitle>
          <SheetDescription>
            {t('search_and_filter_description', { x: t("customer") })}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto ">
          <Form {...form}>
            <form className=" w-full px-3 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('search_by', {x: t('name')})}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('search_by', {x: "Email"})}</FormLabel>
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
                name="createdAtFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('from_date')}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="createdAtTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('to_date')}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
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
