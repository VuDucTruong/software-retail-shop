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
import { CouponCreate, CouponCreateSchema } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useCouponStore } from "@/stores/coupon.store";
import { useActionToast } from "@/hooks/use-action-toast";
import { useShallow } from "zustand/shallow";


export default function CreateCouponPage() {
  const t = useTranslations();

  const [createCoupon , status , lastAction , error] = useCouponStore(useShallow((state) => [
    state.createCoupon,
    state.status,
    state.lastAction,
    state.error,
  ]));

  const form = useForm<CouponCreate>({
    defaultValues: {
      code: "",
      type: "PERCENTAGE",
      availableFrom: isoToDatetimeLocal(new Date().toISOString()),
      availableTo: isoToDatetimeLocal(new Date().toISOString()),
      value: 0,
      minAmount: 0,
      maxAppliedAmount: 0,
      usageLimit: 0,
      description: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(CouponCreateSchema),
  });

  useActionToast({status, lastAction, errorMessage: error || undefined});


  const handleSubmit = (e: any) => {
    e.preventDefault();
    form.handleSubmit((data) => {
      createCoupon(data)
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
              disabled={form.watch("type") === "FIXED"}
              render={({ field }) => (
                <CommonInputOutline title={t("max_applied_amount")}>
                  <Input
                    {...field}
                    type="number"
                    value={form.watch("type") === "FIXED" ? form.watch('value') : field.value}
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

            <Button className="col-start-3">{t("create_coupon")}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
