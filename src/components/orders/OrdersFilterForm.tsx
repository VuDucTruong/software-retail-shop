"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {undefined, z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {useTranslations} from "next-intl";
import {Input} from "../ui/input";
import {IoFilter} from "react-icons/io5";
import {OrderMany} from "@/stores/order/order.store";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Filter} from "lucide-react";
import {OrderStatusSchema} from "@/api";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {StringUtils} from "@/lib/utils";

// const STATUS_OPTIONS = [undefined, ...OrderStatusSchema.options,]
const FormSchema = z.object({
    id: z.string().optional(),
    search: z.string().optional(),
    totalFrom: z.string().optional(),
    status: z.union([OrderStatusSchema, z.literal("IGNORE")]),
    totalTo: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
});
const STATUS_MAP = {
    'none': 'IGNORE',
    'pending': "PENDING",
    'processing': 'PROCESSING',
    'retrying_sending_mail': "RETRY_1",
    'failed on sending mail': "FAILED_MAIL",
    'order successfully delivered': 'COMPLETED',
    'failed on payment': "FAILED"
}
type OrdersFilterFormType = {
    mode: 'all' | 'personal'
}

export function OrdersFilterForm({mode}: OrdersFilterFormType) {
    const getOrders = OrderMany.useStore((state) => state.getOrders);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            id: "",
            search: "",
            totalFrom: "0",
            status: 'IGNORE',
            totalTo: "",
            fromDate: '',
            toDate: '',
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const rawFrom = Math.max(Number(data.totalFrom) || 0, 0)
        const rawTo = Math.min(Number(data.totalTo) || Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
        const totalFNum = rawFrom <= 0 ? undefined : rawFrom;
        const totalTNum = rawTo >= Number.MAX_SAFE_INTEGER ? undefined : rawTo;
        const status = data.status === 'IGNORE' ? undefined : data.status;
        const arrids = data.id?.split(/[\s,]+/)
            .map((v) => Number(v.trim()))
            .filter((v) => !isNaN(v) && v > 0);
        getOrders({
            pageRequest: {
                page: 0,
                size: 10,
                sortBy: "createdAt",
                sortDirection: "desc",
            },
            totalFrom: totalFNum,
            totalTo: totalTNum,
            status: status,
            ids: arrids && arrids.length > 0 ? arrids : [],
            search: StringUtils.hasLength(data.search) ? data.search : undefined
        });
    }

    const t = useTranslations();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="w-fit">
                    <Filter/> {t('search_and_filter', {x: t('orders')})}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{t('search_and_filter', {x: t('orders')})}</SheetTitle>
                    <SheetDescription>
                        {t('search_and_filter_description', {x: t('orders')})}
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-auto ">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full px-3 flex flex-col gap-4">
                            {/* Order id */}
                            <FormField
                                control={form.control}
                                name="id"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{`Your Order Ids (comma delimited)`}</FormLabel>
                                        <FormControl>
                                            <Input className="bg-background"
                                                   type="text" {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {
                                mode === 'all' &&
                                <FormField
                                    control={form.control}
                                    name="search"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>{`${t("full_name")} or email`}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="bg-background"
                                                    type="text"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            }
                            <FormField
                                control={form.control}
                                name="status"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>{t("Categories")}</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(STATUS_MAP).map(([k, v],) => (
                                                        <SelectItem key={k} value={v}>
                                                            {k}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />


                            {/* Price */}
                            <FormField
                                control={form.control}
                                name="totalFrom"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{t("price_from")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-background"
                                                step={1000}
                                                type="number"
                                                min={0}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="totalTo"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{t("price_to")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-background"
                                                step={1000}
                                                type="number"
                                                min={0}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* From Date */}
                            <FormField
                                control={form.control}
                                name="fromDate"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{t("from_date")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-background"
                                                type="date"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* To Date */}
                            <FormField
                                control={form.control}
                                name="toDate"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{t("to_date")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-background"
                                                type="date"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">
                                <IoFilter/>
                                {t("Filter")}
                            </Button>
                        </form>
                    </Form>

                </div>
            </SheetContent>
        </Sheet>
    );
}
