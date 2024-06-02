import axios from "axios";

const URL = "http://localhost:8080";

interface ErrorResponse {
    error: string;
}

interface AddReviewData {
    rating: number;
    review: string;
}

export const serviceAddReview = async (
    token: string,
    productId: number,
    data: AddReviewData,
): Promise<string | null> => {
    try {
        await axios.post<void>(
            `${URL}/review/${productId}`,
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

export const serviceUpdateReview = async (
    token: string,
    reviewId: number,
    data: AddReviewData,
): Promise<string | null> => {
    try {
        await axios.put<void>(
            `${URL}/review/${reviewId}`,
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

export const serviceDeleteReview = async (
    token: string,
    reviewId: number,
): Promise<string | null> => {
    try {
        await axios.delete<void>(
            `${URL}/review/${reviewId}`,
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