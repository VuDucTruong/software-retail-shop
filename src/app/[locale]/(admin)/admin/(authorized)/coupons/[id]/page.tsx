"use client";
import CommonInputOutline from "@/components/common/CommonInputOutline";
import ValueTypeInput from "@/components/coupon/ValueTypeInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isoToDatetimeLocal } from "@/lib/date_helper";
import { Coupon, CouponCreate, CouponUpdate, CouponUpdateSchema } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useCouponStore } from "@/stores/coupon.store";
import { useActionToast } from "@/hooks/use-action-toast";
import LoadingPage from "@/components/special/LoadingPage";

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
    resolver: zodResolver(CouponUpdateSchema),
  });

  useEffect(() => {
    if (selectedCoupon) {
      form.reset({
        ...selectedCoupon,
        availableFrom: isoToDatetimeLocal(selectedCoupon.availableFrom),
        availableTo: isoToDatetimeLocal(selectedCoupon.availableTo),
      });
    }
  }, [selectedCoupon]);

  if (!selectedCoupon) {
    return LoadingPage();
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();

    form.handleSubmit(async (data) => {
      console.log(data);
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

            <div className="col-span-2">
              <ValueTypeInput />
            </div>

            <FormField
              name="availableFrom"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("available_from")}>
                  <Input {...field} type="datetime-local" />
                </CommonInputOutline>
              )}
            />

            <FormField
              name="availableTo"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("available_to")}>
                  <Input {...field} type="datetime-local" />
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
