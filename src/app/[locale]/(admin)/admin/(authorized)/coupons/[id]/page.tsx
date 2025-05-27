"use client";
import { CouponUpdate, CouponUpdateSchema } from "@/api";
import CommonInputOutline from "@/components/common/CommonInputOutline";
import CouponTypeSelect from "@/components/coupon/CouponTypeSelect";
import LoadingPage from "@/components/special/LoadingPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionToast } from "@/hooks/use-action-toast";
import { getDateLocal } from "@/lib/date_helper";
import { useCouponStore } from "@/stores/coupon.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";

export default function ConponDetailPage() {
  const t = useTranslations();
  const pathName = usePathname();
  const couponId = pathName.split("/").pop() ?? "0";

  const [
    selectedCoupon,
    getCouponById,
    lastAction,
    status,
    error,
    updateCoupon,
  ] = useCouponStore(
    useShallow((state) => [
      state.selectedCoupon,
      state.getCouponById,
      state.lastAction,
      state.status,
      state.error,
      state.updateCoupon,
    ])
  );

  useActionToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });

  useEffect(() => {
    if (couponId) {
      getCouponById(Number(couponId));
    }
  }, []);

  const form = useForm<CouponUpdate>({
    mode: "onSubmit",
    defaultValues: {
      code: "",
      type: "PERCENTAGE",
      availableFrom: getDateLocal(),
      availableTo:  getDateLocal(),
      value: 0,
      minAmount: 0,
      maxAppliedAmount: 0,
      usageLimit: 0,
      description: "",
    },
    resolver: zodResolver(CouponUpdateSchema),
  });

  useEffect(() => {
    if (selectedCoupon) {
      form.reset({
        ...selectedCoupon,
      });
    }
  }, [selectedCoupon]);

  if (!selectedCoupon) {
    return LoadingPage();
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();

    form.handleSubmit(async (data) => {
      if (data.type === "FIXED") {
        data.maxAppliedAmount = data.value;
      }
      updateCoupon(data);
    })();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t("coupon_x", { x: couponId })}</h2>
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
                    value={field.value}
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
                  <CouponTypeSelect {...field} value={field.value} onValueChange={field.onChange} hasAllOption={false} />
                </CommonInputOutline>
              )}
            />

            <div></div>

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
              render={({ field }) => (
                <CommonInputOutline title={t("max_applied_amount")}>
                  <Input
                    {...field}
                    type="number"
                    value={
                      form.watch("type") === "FIXED"
                        ? form.watch("value")
                        : field.value
                    }
                  />
                </CommonInputOutline>
              )}
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

            <Button className="col-start-3 bg-green-400 hover:bg-green-500">
              {t("update_coupon")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
