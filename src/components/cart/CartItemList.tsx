import {useTranslations} from 'next-intl'
import React from 'react'
import CartItem, {CartItemDataType} from './CartItem';
import {OrderCustomer} from "@/stores/order/order.store";
import {useShallow} from "zustand/shallow";
import {CartLocal} from "@/stores/order/cart.store";


export default function CartItemList() {
    const t = useTranslations();

    const [orderItems, removeOrderItem, setOrderItemQty] = OrderCustomer.useStore(useShallow(s => [
        s.cartItems, s.removeCartItem, s.setQty
    ]))
    const [subtractLocalQty, removeLocalItem, setLocalItem] = CartLocal.useStore(useShallow(s => [s.subtractItem, s.removeItem, s.setItem]))

    const data: CartItemDataType[] = orderItems.map(od => ({
        ...od,
        product: {
            ...od.product,
            price: od.price,
            originalPrice: od.originalPrice
        }
    }))

    function onOrderItemQtyChange(index: number, qty: number) {
        const item = orderItems[index];
        const [id, pName] = [item.product.id, item.product.name];
        if (qty <= 0)
            return
        setLocalItem(id + '', {name: pName, qty: qty})
        setOrderItemQty(index, qty);
    }

    function onRemoveItem(index: number) {
        const id = orderItems[index].product.id;
        removeLocalItem(id + '',)
        removeOrderItem(index)
    }

    return (
        <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-2'>
                {
                    data.map((item, index) => {
                        return (
                            <CartItem key={index} index={index} data={item} onQtyChange={onOrderItemQtyChange}
                                      onDelete={onRemoveItem}/>
                        )
                    })
                }
            </div>
        </div>
    )
}
