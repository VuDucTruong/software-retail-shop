import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ProductComboBox } from "./ProductComboBox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Product, ProductItemCreate, ProductItemCreateSchema, ProductItemDetail } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Key, Link } from "lucide-react";
import { regions } from "@/lib/constants";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { create } from "domain";
import { useProductItemStore } from "@/stores/product.item.store";

export default function KeyInsertDialog() {
  const t = useTranslations();

  const productRef = React.useRef<Product | null>(null);
    const createProductItems = useProductItemStore(
        (state) => state.createProductItems)
  const form = useForm<ProductItemCreate>({
    defaultValues: {
      productId: null,
      productKey: "",
      region: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(ProductItemCreateSchema),
  });

  const handleSubmit = () => {
    form.handleSubmit((data) => {
       
        if (productRef.current === null) {
            toast.error(t('please_select_product'));
            return;
        }
        const productItem:ProductItemDetail = {
            productId: productRef.current.id,
            productKey: data.productKey,
            region: data.region,
            id: -1,
            createdAt: new Date().toISOString(),
            imageUrl: productRef.current.imageUrl,
            name: productRef.current.name,
            originalPrice: productRef.current.originalPrice,
            price: productRef.current.price,
            represent: productRef.current.represent,
            slug: productRef.current.slug,
            used: false
            
        };
        createProductItems([productItem])
        })();
    }

  return (
    <Dialog onOpenChange={(open) => {
        if (!open) {
            form.reset();
            productRef.current = null;
        }
    }}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>{t('add_product_key_manually')}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('add_new_product_key')}</DialogTitle>
          <DialogDescription>
            {t('add_new_product_key_description')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <ProductComboBox ref={productRef} />

          <Form {...form}>
            <form className="flex gap-4 items-start">
              <FormField
                name="productKey"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1">
                      <FormLabel>
                        {t('product_key')}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                name="region"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem >
                      <FormLabel>
                        {t('Region')}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('select_region')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            regions.map((region) => (
                              <SelectItem key={region.value} value={region.value}>
                                {region.label}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              
            </form>
          </Form>
          <div className="flex items-center justify-end">
            <Button disabled={false} onClick={handleSubmit}>
            {t('add_new_product_key')}
            <Key />
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
