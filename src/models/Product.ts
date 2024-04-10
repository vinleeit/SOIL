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