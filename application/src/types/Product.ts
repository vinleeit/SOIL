export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    imageURL: string;
    discountAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

export function GetProductPrice(product: Product): number {
    if (product.discountAmount > 0) {
        return product.price - (product.price * 0.5)
    }
    return product.price
}