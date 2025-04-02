import { useTranslations } from 'next-intl'
import React, { useRef } from 'react'
import CartItem from './CartItem';

export default function CartItemList() {
    const t = useTranslations();
    const productItems = [
        {
            title: "Product 1",
            tags: ["tag1", "tag2"],
            image: "/banner.png",
            isAvailable: true,
            price: 100,
            originalPrice: 120,
            quantity: useRef(1),
            status: "in_stock",
            onDelete: (id: number) => {
                console.log(productItems[id].quantity)
            },
        },
        {
            title: "Product 2",
            tags: ["tag3", "tag4"],
            image: "/banner.png",
            isAvailable: false,
            price: 200,
            originalPrice: 250,
            quantity: useRef(1),
            status: "in_stock",
            onDelete: (id: number) => {
                console.log(productItems[id].quantity)
            },
        },
        {
            title: "Product 3",
            tags: ["tag5", "tag6"],
            image: "/banner.png",
            isAvailable: true,
            price: 150,
            originalPrice: 180,
            quantity: useRef(1),
            status: "out_of_stock",
            onDelete: (id: number) => {
                console.log(productItems[id].quantity)
            },
        },
    ]
  return (
    <div className='flex flex-col gap-3'>
        <h3>{t('Cart')} <span className='text-sm font-normal text-muted-foreground'>( {productItems.length} {t('product')} )</span></h3>
        <div className='flex flex-col gap-2'>
            {
                productItems.map((item, index) => {
                    return (
                        <CartItem key={index} id={index} {...item}/>
                    )
                })
            }
        </div>
    </div>
  )
}
