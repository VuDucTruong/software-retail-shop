"use client";
import {useEffect} from "react";

import ProductInfo from "@/components/product/ProductInfo";
import RelatedProductSection from "@/components/product/RelatedProductSection";
import UserCommentSection from "@/components/product/UserCommentSection";
import {RichTextViewer} from "@/components/rich_text/RichTextViewer";
import LoadingPage from "@/components/special/LoadingPage";
import {usePathname} from "@/i18n/navigation";
import {useClientProductStore} from "@/stores/cilent/client.product.store";
import {get} from "lodash";
import {useTranslations} from "next-intl";
import {notFound} from "next/navigation";


export default function DetailProductPage() {
  const t = useTranslations();
  const pathname = usePathname();
  const slug = pathname.split("/").pop() || "";
  const selectedProduct = useClientProductStore(
    (state) => state.selectedProduct
  );
  const getProductBySlug = useClientProductStore(
    (state) => state.getProductBySlug
  );
  const error = useClientProductStore((state) => state.error);
  const lastAction = useClientProductStore(
    (state) => state.lastAction
  );

  useEffect(() => {
    if(getProductBySlug!==undefined)
        getProductBySlug(slug);
  }, []);


  if(error && lastAction === null) {
    return notFound();
  }

  if (!selectedProduct) {
    return <div className="flex flex-col items-center justify-center h-screen">
      <LoadingPage />
    </div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Product General Info */}
      <ProductInfo product={selectedProduct} />

      {/* Warning */}
      <div className="bg-border/20 rounded-md shadow-sm w-fit min-w-1/4 main-container">
        <p className="text-red-500 font-semibold text-lg">{t("Note")}</p>
        <RichTextViewer content={selectedProduct.productDescription?.tutorial ?? ""} />
      </div>

      {/* Description */}

      {selectedProduct.productDescription &&
        Object.keys(selectedProduct.productDescription).map((key) => {
          if (key === "tutorial") return null;
          const value = get(selectedProduct.productDescription, key);
          return (
            <div className="grid grid-cols-3 gap-4 main-container border-b border-border pb-4" key={key}>
              <h3>{t(key)}</h3>
              <div className="col-span-2">
                <RichTextViewer content={value} />
              </div>
            </div>
          );
        })}
      {/* Rating */}
      <div className="flex flex-row justify-end font-semibold border-b border-neutral-300 pb-4 main-container">
        {t("Rating")}: 4.5 ⭐ (1000 {t("Votes")})
      </div>

      {/* Related products List */}

      <div className="main-container">
        <RelatedProductSection  />
      </div>

      {/* Comments */}

      <UserCommentSection productId={selectedProduct.id}/>
    </div>
  );
}
