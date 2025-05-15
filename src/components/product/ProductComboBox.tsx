"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn, delay } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProductStore } from "@/stores/product.store";
import { useEffect } from "react";
import { Product } from "@/api";
import debounce from "lodash/debounce";
import Image from "next/image";

export function ProductComboBox({
  ref,
}: {
  ref: React.RefObject<number | null>;
}) {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [open, setOpen] = React.useState(false);
  const getProducts = useProductStore((state) => state.getProducts);
  const status = useProductStore((state) => state.status);
  const products = useProductStore((state) => state.products);

  const handleSearch = (value: string) => {
    getProducts({
      pageRequest: {
        page: 0,
        size: 6,
        sortBy: "id",
        sortDirection: "desc",
      },
      search: value,
    });
  };

  useEffect(() => {
    getProducts({
      pageRequest: {
        page: 0,
        size: 6,
        sortBy: "id",
        sortDirection: "desc",
      },
    });
  }, []);

  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        handleSearch(value);
      }, 400),
    []
  );

  return (
    <div className="flex flex-col gap-2">
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between w-[300px]"
            role="combobox"
            aria-expanded={open}
          >
            Chọn sản phẩm...
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandInput
              placeholder="Tìm kiếm sản phẩm"
              onValueChange={debouncedSearch}
              className="h-9"
            />
            <CommandList>
              {status === "loading" ? (
                <div className="flex items-center justify-center w-full h-20">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              ) : products?.data?.length === 0 ? (
                <CommandEmpty>Không có sản phẩm nào cả...</CommandEmpty>
              ) : (
                <CommandGroup forceMount>
                  {(products?.data ?? []).map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.id.toString()}
                      onSelect={() => {
                        setSelectedProduct(product);
                        ref.current = product.id;
                        setOpen(false);
                      }}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">Tên: {product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Mã SP: {product.slug}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Nhãn: {product.tags.join(", ")}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedProduct && (
        <div className="flex items-center gap-2">
          <div className="relative size-20 rounded-md overflow-hidden border border-border">
            <Image
              src={selectedProduct?.imageUrl ?? "/empty_img.png"}
              alt="product image"
              fill
              sizes="100%"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-lg font-semibold">
              {selectedProduct?.id} - {selectedProduct?.name}
            </div>
            <div className="text-sm text-muted-foreground">
              Mã SP: {selectedProduct?.slug}
            </div>
            <div className="text-sm text-muted-foreground">
              Nhãn: {selectedProduct?.tags.join(",")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
