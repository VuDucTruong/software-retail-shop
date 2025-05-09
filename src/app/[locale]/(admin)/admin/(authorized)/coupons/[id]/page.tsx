'use client'
import CommonInputOutline from "@/components/common/CommonInputOutline";
import ValueTypeInput from "@/components/coupon/ValueTypeInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isoToDatetimeLocal } from "@/lib/date_helper";
import { Coupon, CouponCreate, CouponValidation } from "@/api/coupon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";


const selectedCoupon = {
    id: 1,
    code: "TEST",
    type: "FIXED",
    availableFrom: new Date().toISOString(),
    availableTo: new Date().toISOString(),
    value: 10,
    minAmount: 100,
    maxAppliedAmount: 50,
    usageLimit: 10,
    description: "Test coupon",
}

import React from 'react'



export default function ConponDetailPage() {
  const t = useTranslations();
  const pathName = usePathname();
  const couponId = pathName.split("/").pop() ?? "0";
  const form = useForm<Coupon>({
    defaultValues: {
      ...selectedCoupon,
        availableFrom: isoToDatetimeLocal(selectedCoupon.availableFrom),
        availableTo: isoToDatetimeLocal(selectedCoupon.availableTo),
    },
    mode: "onSubmit",
    resolver: zodResolver(CouponValidation),
  });


  const handleSubmit = (e: any) => {
    e.preventDefault();

    form.handleSubmit(async (data) => {
      console.log(data);
    })();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t("coupon_x", {x: couponId})}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-y-8 gap-x-10">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t('coupon_code')}>
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
                  <Input
                    {...field}
                    type="datetime-local"
                    min={isoToDatetimeLocal(new Date().toISOString())}
                  />
                </CommonInputOutline>
              )}
            />

            <FormField
              name="availableTo"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("available_to")}>
                  <Input
                    {...field}
                    type="datetime-local"
                  />
                </CommonInputOutline>
              )}
            />

            <div></div>

            <FormField
              name="minAmount"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("min_amount")}>	
                  <Input
                    {...field}
                    type="number"
                  />
                </CommonInputOutline>
              )}
            />

            <FormField
              name="maxAppliedAmount"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("max_applied_amount")}>
                  <Input
                    {...field}
                    type="number"
                  />
                </CommonInputOutline>
              )}
            />

            <FormField
              name="usageLimit"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("max_uses")}>
                  <Input
                    {...field}
                    type="number"
                  />
                </CommonInputOutline>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <CommonInputOutline title={t("Description")} className="col-span-3">
                  <Textarea {...field} />
                </CommonInputOutline>
              )}
            />

            <Button className="col-start-3 bg-green-400 hover:bg-green-500">{t("update_coupon")}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
