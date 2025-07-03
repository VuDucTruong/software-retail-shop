import Link from "next/link";
import React, {useEffect} from "react";
import {FaShoppingCart} from "react-icons/fa";
import {Button} from "../ui/button";
import {CartLocal} from "@/stores/order/cart.store";
import {useShallow} from "zustand/shallow";

export default function CartButton() {
  const [cartItems, loadCarts] = CartLocal.useStore(useShallow(s=>[
    s.orderDetailsMeta, s.load
  ]))

  useEffect(()=>{
    loadCarts();
  },[])

  const count = Object.entries(cartItems).length

  return (
    <div className="p-4">
      <Link href={"/cart"}>
        <Button variant={"ghost"} className="relative size-12 text-primary hover:text-primary hover:bg-primary/10">
          <FaShoppingCart className="size-6" />
          <span className="absolute -top-2 -right-2 text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-sm">
            {count}
          </span>
        </Button>
      </Link>
    </div>
  );
}
