import {useTranslations} from 'next-intl'
import React from 'react'
import CartItem, {CartItemDataType} from './CartItem';


export default function CartItemList({data}: {data: CartItemDataType[]}) {
    const t = useTranslations();
    
  return (
    <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-2'>
            {
                data.map((item, index) => {
                    return (
                        <CartItem key={index} {...item}/>
                    )
                })
            }
        </div>
    </div>
  )
}
