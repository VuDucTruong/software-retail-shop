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
import { ProductItemCreate, ProductItemCreateSchema } from "@/api";
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

  const productIdRef = React.useRef<number | null>(null);
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
        console.log("data", data);
        if (productIdRef.current === null) {
            toast.error("Vui lòng chọn sản phẩm");
            return;
        }
        const productItem = {
            ...data,
            productId: productIdRef.current,
        };
        createProductItems([productItem])
        })();
    }

  return (
    <Dialog onOpenChange={(open) => {
        if (!open) {
            form.reset();
            productIdRef.current = null;
        }
    }}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>{"Thêm khóa phần mềm thủ công"}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Thêm khóa mới"}</DialogTitle>
          <DialogDescription>
            Chọn sản phẩm cần thêm , sau đó nhập những thông tin cần thiết khác
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <ProductComboBox ref={productIdRef} />

          <Form {...form}>
            <form className="flex gap-4 items-start">
              <FormField
                name="productKey"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1">
                      <FormLabel>
                        {"Mã sản phẩm"}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nhập khóa sản phẩm"
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
                        {"Khu vực"}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn khu vực" />
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
            {"Thêm khóa sản phẩm"}
            <Key />
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
