import React from "react";
import { Button } from "../ui/button";
import {useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {  StatisticQuerySchema } from "@/api";
import { Form, FormControl, FormField } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useShallow } from "zustand/shallow";

type FormValues = {
  dateRange: DateRange;
};

export default function DashboardFilterForm() {
  const t = useTranslations();
  const [queryParams, setQueryParams] = useDashboardStore(useShallow(state => [state.queryParams,state.setQueryParams]));
  const form = useForm<FormValues>({
    defaultValues: {
      dateRange: {
        from: new Date(queryParams.from ?? ""),
        to: new Date(queryParams.to ?? ""),
      },
    },
    mode: "onSubmit",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.handleSubmit((data) => {
     const query = StatisticQuerySchema.parse({
      from: data.dateRange.from,
      to: data.dateRange.to,
     });
      setQueryParams(query);
    })();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-row gap-4 items-center border - border-border px-3 rounded-md shadow-md"
      >
        <div className="whitespace-nowrap font-medium">{t("time_range")}:</div>
        <FormField
          name="dateRange"
          control={form.control}
          render={({ field }) => {
            return (
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        <span>
                          {format(field.value.from ?? new Date(), "PP")} -{" "}
                          {format(field.value.to ?? new Date(), "PP")}
                        </span>
                      ) : (
                        <span>{t('pick_date_range')}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    captionLayout="dropdown"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            );
          }}
        />
        <Button type="submit" className="btn btn-primary">
          {t("apply_filters")}
        </Button>
      </form>
    </Form>
  );
}
