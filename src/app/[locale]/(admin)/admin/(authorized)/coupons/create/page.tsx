"use client";
import CommonInputOutline from "@/components/common/CommonInputOutline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { CouponCreate, CouponCreateSchema } from "@/api";
import CouponTypeSelect from "@/components/coupon/CouponTypeSelect";
import { useActionToast } from "@/hooks/use-action-toast";
import { getDateLocal } from "@/lib/date_helper";
import { useCouponStore } from "@/stores/coupon.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";

export default function CreateCouponPage() {
  const t = useTranslations();

  const [createCoupon, status, lastAction, error] = useCouponStore(
    useShallow((state) => [
      state.createCoupon,
      state.status,
      state.lastAction,
      state.error,
    ])
  );

  const form = useForm<CouponCreate>({
    defaultValues: {
      code: "",
      type: "PERCENTAGE",
      availableFrom: getDateLocal(),
      availableTo: getDateLocal(),
      value: 0,
      minAmount: 0,
      maxAppliedAmount: 0,
      usageLimit: 0,
      description: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(CouponCreateSchema),
  });

  useActionToast({ status, lastAction, errorMessage: error || undefined });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit((data) => {
      if (data.type === "FIXED") {
        data.maxAppliedAmount = data.value;
      }
      createCoupon(data);
    })();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t("create_coupon")}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-3 gap-y-8 gap-x-10"
          >
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("coupon_code")}>
                  <Input {...field} />
                </CommonInputOutline>
              )}
            />

            <FormField
              name="availableFrom"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("available_from")}>
                  <Input {...field} type="date" />
                </CommonInputOutline>
              )}
            />

            <FormField
              name="availableTo"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("available_to")}>
                  <Input {...field} type="date" />
                </CommonInputOutline>
              )}
            />

            <FormField
              name="value"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("discount_value")}>
                  <Input
                    {...field}
                    type="number"
                    max={form.watch("type") === "PERCENTAGE" ? 100 : undefined}
                  />
                </CommonInputOutline>
              )}
            />
            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline
                  title={t("discount_type")}
                  className="border-l-0"
                >
                  <CouponTypeSelect
                    {...field}
                    value={field.value}
                    onValueChange={field.onChange}
                    hasAllOption={false}
                  />
                </CommonInputOutline>
              )}
            />

            <FormField
              name="minAmount"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("min_amount")}>
                  <Input {...field} type="number" />
                </CommonInputOutline>
              )}
            />

            <FormField
              name="maxAppliedAmount"
              control={form.control}
              disabled={form.watch("type") === "FIXED"}
              render={({ field }) => {
                const isFixed = form.watch("type") === "FIXED";
                return (
                  <CommonInputOutline title={t("max_applied_amount")}>
                    <Input
                      {...field}
                      type="number"
                      value={isFixed ? form.watch("value") : field.value}
                    />
                  </CommonInputOutline>
                );
              }}
            />

            <FormField
              name="usageLimit"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("max_uses")}>
                  <Input {...field} type="number" />
                </CommonInputOutline>
              )}
            />

            

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline
                  title={t("Description")}
                  className="col-span-3"
                >
                  <Textarea {...field} />
                </CommonInputOutline>
              )}
            />

            <Button type="submit" className="col-start-3">{t("create_coupon")}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
