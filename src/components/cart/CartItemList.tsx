import {useTranslations} from 'next-intl'
import React from 'react'
import CartItem, {CartItemDataType} from './CartItem';
import {OrderCustomer} from "@/stores/order/order.store";
import {useShallow} from "zustand/shallow";


export default function CartItemList() {
    const t = useTranslations();

    const [cartItems, removeCartItem, onQtyChange] = OrderCustomer.useStore(useShallow(s => [
        s.cartItems, s.removeCartItem, s.setQty
    ]))

    const data: CartItemDataType[] = cartItems.map(od => ({
        ...od,
        product: {
            ...od.product,
            price: od.price,
            originalPrice: od.originalPrice
        }
    }))

    return (
        <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-2'>
                {
                    data.map((item, index) => {
                        return (
                            <CartItem key={index} index={index} data={item} onQtyChange={onQtyChange}
                                      onDelete={removeCartItem}/>
                        )
                    })
                }
            </div>
        </div>
    )
}
