import axios from 'axios';
import { ProductDetail, Review } from '../../types/ProductDetail';

const URL = "http://localhost:8080";

interface ErrorResponse {
    error: string;
}

export type ProductDetailResponse = {
    id: number;
    name: string;
    description: string;
    price: string;
    imageURL: string;
    discountAmount: string;
    createdAt: string;
    updatedAt: string;
    Reviews: Review[];
};

export const serviceGetProductDetail = async (
    productId: number
): Promise<[ProductDetail | null, string | null]> => {
    try {
        const response = await axios.get<ProductDetailResponse>(`${URL}/product/${productId}`);
        return [{
            ...response.data,
            discountAmount: parseFloat(response.data.discountAmount),
            price: parseFloat(response.data.price),
        }, null];
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