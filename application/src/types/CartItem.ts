import { Product } from "./Product"

export type CartItem = {
    id: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    productId: number;
    product: Product;
}