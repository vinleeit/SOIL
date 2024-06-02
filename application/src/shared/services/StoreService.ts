import axios from "axios";
import { Product } from "../../types/Product";
import { CartItem } from "../../types/CartItem";

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

interface CartResponse {
    id: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    UserId: number;
    ProductId: number;
    Product: ProductResponse;
}

interface AddCartData {
    productId: number;
    quantity: number;
}

interface UpdateCartData {
    quantity: number;
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

export const serviceGetCart = async (
    token: string,
): Promise<[Map<number, CartItem> | null, error: string | null]> => {
    try {
        const response = await axios.get<CartResponse[]>(
            `${URL}/cart`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            const cartItems = response.data;
            const convertedCartItems: Map<number, CartItem> = cartItems.reduce((map, item) => {
                map.set(item.ProductId, ({
                    id: item.id,
                    quantity: item.quantity,
                    createdAt: new Date(item.createdAt),
                    updatedAt: new Date(item.updatedAt),
                    userId: item.UserId,
                    productId: item.ProductId,
                    product: {
                        ...item.Product,
                        price: parseFloat(item.Product.price),
                        discountAmount: parseFloat(item.Product.discountAmount),
                        createdAt: new Date(item.Product.createdAt),
                        updatedAt: new Date(item.Product.updatedAt),
                    },
                }));
                return map;
            }, new Map<number, CartItem>());

            return [convertedCartItems, null];
        } else {
            return [null, 'Failed to fetch cart'];
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

export const serviceAddCartProduct = async (
    token: string,
    data: AddCartData,
): Promise<string | null> => {
    try {
        await axios.post<void>(
            `${URL}/cart`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return null;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorData: ErrorResponse = error.response.data;
            return errorData.error;
        } else {
            console.log(error);
            return 'An unexpected error occurred';
        }
    }
};

export const serviceUpdateCartProduct = async (
    token: string,
    productId: number,
    data: UpdateCartData,
): Promise<string | null> => {
    try {
        await axios.put<void>(
            `${URL}/cart/${productId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return null;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorData: ErrorResponse = error.response.data;
            return errorData.error;
        } else {
            console.log(error);
            return 'An unexpected error occurred';
        }
    }
};

export const serviceDeleteCartProduct = async (
    token: string,
    productId: number
): Promise<string | null> => {
    try {
        await axios.delete<void>(
            `${URL}/cart/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return null;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorData: ErrorResponse = error.response.data;
            return errorData.error;
        } else {
            console.log(error);
            return 'An unexpected error occurred';
        }
    }
};