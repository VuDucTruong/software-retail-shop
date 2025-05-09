import { Product } from "@/api";

export type Cart = {
    id: number;
    product: Product
    quantity: number;
}

export type CartCreate = {
    id: number;
    product_id: number;
    quantity: number;
}