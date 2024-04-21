import { Review } from "./Review"

export type Product = {
    id: number
    title: string
    description: string
    price: number
    reviews: Review[]
    photoUrl: string
    sources: string[]
    isSpecial: boolean
}

export function GetProductPrice(product: Product): number {
    if (product.isSpecial) {
        return product.price - (product.price * 0.5)
    }
    return product.price
}