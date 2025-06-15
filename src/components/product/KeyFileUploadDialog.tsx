"use client";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";

import {
  ProductItemCreate,
  ProductItemCreateSchema,
  ProductItemDetail
} from "@/api";
import { useProductItemStore } from "@/stores/product.item.store";
import { useProductStore } from "@/stores/product.store";
import { Import, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { KeyDataTable } from "./KeyDataTable";

export type ProductItemPreview = {
  productName: string;
  productId: number;
  productKey: string;
  region: string;
};

export default function KeyFileUploadDialog() {
  const t = useTranslations();
  const createProductItems = useProductItemStore(
    (state) => state.createProductItems
  );
  const getProducts = useProductStore((state) => state.getProducts);
  const products = useProductStore((state) => state.products);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductItemDetail[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const parseDataRef = useRef<ProductItemCreate[]>([]);
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData.length === 0) {
          setError("File is empty.");
          return;
        }

        // ✅ Validate headers
        const expectedHeaders = Object.keys(ProductItemCreateSchema.shape);
        const fileHeaders = Object.keys(jsonData[0] as Record<string, any>);

        const missingHeaders = expectedHeaders.filter(
          (header) => !fileHeaders.includes(header)
        );

        if (missingHeaders.length > 0) {
          setError(`Missing required headers: ${missingHeaders.join(", ")}`);
          return;
        }

        // contain productId, productKey , region
        const parsedData = ProductItemCreateSchema.array().parse(jsonData);
        parseDataRef.current = parsedData;
        // get all existing products
        await getProducts({
          ids: parsedData.map((item) => item.productId ?? -1),
        });

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to parse file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };


  useEffect(() => {
    if(products) {
      setData(
          parseDataRef.current.map((item) => {
            const existingProduct = products?.data.find(
              (product) => product.id === item.productId
            );

            const productItemDetail: ProductItemDetail = {
              id: -1,
              slug: existingProduct?.slug || "",
              name: existingProduct?.name || "Không tồn tại",
              imageUrl: existingProduct?.imageUrl || "",
              represent: existingProduct?.represent || true,
              price: existingProduct?.price || 0,
              originalPrice: existingProduct?.originalPrice || 0,
              productId: item.productId ?? -1,
              productKey: item.productKey,
              createdAt: new Date().toISOString(),
              region: item.region,
              used: false,
            };

            return productItemDetail;
          })
        );
    }
  }, [products]);

  const handleDelete = (ids: number[]) => {
    const newData = data.filter((item) => !ids.includes(item.productId));
    setData(newData);
  };

  const handleReset = () => {
    setData([]);
    setError(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleImportKeys = () => {
    createProductItems(data);
    handleReset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center bg-green-400 hover:bg-green-500 gap-2">
          <Import />
          {t("import_key")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("import_key")}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <input
            type="file"
            ref={fileRef}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-100 file:text-green-700
                        hover:file:bg-green-200"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <KeyDataTable data={data} onDelete={handleDelete} />
          <div className="flex items-center gap-6 mt-4">
            <Button className="flex-1" onClick={handleImportKeys}>
              {t("Accept")}
            </Button>
            <Button
              className="flex-1"
              variant={"destructive"}
              onClick={handleReset}
            >
              <RefreshCcw />
              {t("Reset")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
