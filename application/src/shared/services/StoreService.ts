import axios from "axios";
import { Product } from "../../types/Product";

const URL = "http://localhost:8080"

interface ProductResponse {
    id: number;
    name: string;
    description: string;
    price: string;
    imageURL: string;
    discountAmount: string;
    createdAt: string;
    updatedAt: string;
}

interface ErrorResponse {
    error: string;
}

export const serviceGetProducts = async (
): Promise<[result: Product[] | null, error: string | null]> => {
    try {
        const response = await axios.get<ProductResponse[]>(`${URL}/product`);
        if (response.status === 200) {
            const products = response.data;
            const convertedProducts: Product[] = products.map((product) => ({
                ...product,
                price: parseFloat(product.price),
                discountAmount: parseFloat(product.discountAmount),
                createdAt: new Date(product.createdAt),
                updatedAt: new Date(product.updatedAt),
            }));
            return [convertedProducts, null];
        } else {
            return [null, 'Failed to fetch products']
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorData: ErrorResponse = error.response.data;
            return [null, errorData.error];
        } else {
            console.log(error);
            return [null, 'An unexpected error occurred'];
        }
    }
};