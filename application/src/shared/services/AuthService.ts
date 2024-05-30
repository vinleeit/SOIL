import axios from 'axios';

const URL = "http://localhost:8080"

export interface ProfileResponse {
    email: string;
    username: string;
    createdAt: string;
}

interface LoginResponse {
    token: string;
}

interface ErrorResponse {
    error: string;
}

export const loginService = async (
    email: string,
    password: string,
): Promise<[result: string | null, error: string | null]> => {
    try {
        const response = await axios.post<LoginResponse>(`${URL}/auth/login`, {
            email,
            password,
        });
        return [response.data.token, null];
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

export const profileService = async (
    token: string
): Promise<[result: ProfileResponse | null, error: string | null]> => {
    try {
        const response = await axios.get<ProfileResponse>(`${URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return [response.data, null];
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorData: ErrorResponse = error.response.data;
            return [null, errorData.error];
        } else {
            console.log(error);
            return [null, "An unexpected error occurred"];
        }
    }
};