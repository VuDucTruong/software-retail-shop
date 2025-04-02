import { useTranslations } from 'next-intl';
import Image from 'next/image'
import React from 'react'

export default function EmptyList() {
    const t = useTranslations();
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
              <h4>{t("empty_cart")}</h4>
              <p>{t("empty_cart_description")}</p>
              <div className="relative w-[300px] h-[300px]">
                <Image alt="Empty cart image" src={"/empty-cart.png"} fill />
              </div>
            </div>
  )
}
