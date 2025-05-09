"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as XLSX from "xlsx";

import { ProductItem, ProductItemSchema } from "@/api";
import { Import } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { KeyDataTable } from "./KeyDataTable";

export default function KeyFileUploadDialog() {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductItem[]>([]);
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
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
        const expectedHeaders = Object.keys(ProductItemSchema.shape);
        const fileHeaders = Object.keys(jsonData[0] as Record<string, any>);

        const missingHeaders = expectedHeaders.filter(
          (header) => !fileHeaders.includes(header)
        );

        if (missingHeaders.length > 0) {
          setError(`Missing required headers: ${missingHeaders.join(", ")}`);
          return;
        }

        const parsedData = ProductItemSchema.array().parse(jsonData);
        setData(parsedData);

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to parse file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDelete = (ids: number[]) => {
    const newData = data.filter((item) => !ids.includes(item.productId));
    setData(newData);
  };

  const handleImportKeys = () => {};

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setError(null);
          setData([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center bg-green-400 hover:bg-green-500 gap-2">
          <Import />
          {t("import_key")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("import_key")}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <input
            type="file"
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
          <Button className="w-full mt-4" onClick={handleImportKeys}>
              {t("Accept")}
            </Button>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}
