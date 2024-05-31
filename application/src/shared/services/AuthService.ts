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

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    username: string;
}

interface UpdateProfileData {
    email?: string;
    username?: string;
}

export const loginService = async (
    data: LoginData,
): Promise<[result: string | null, error: string | null]> => {
    try {
        const response = await axios.post<LoginResponse>(`${URL}/auth/login`, data);
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

export const registerService = async (
    data: RegisterData,
): Promise<string | null> => {
    try {
        await axios.post(`${URL}/auth/register`, data);
        return null;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorData: ErrorResponse = error.response.data;
            return errorData.error;
        } else {
            console.log(error);
            return "An unexpected error occurred";
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

export const updateProfileService = async (
    token: string,
    data: UpdateProfileData,
): Promise<string | null> => {
    try {
        await axios.post<void>(`${URL}/profile`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return null;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response?.data) {
                const errorData: ErrorResponse = error.response.data;
                return errorData.error;
            }

            if (error.response.status == 304) {
                return "No data modification is provided";
            }

            return error.response.statusText;
        } else {
            console.log(error);
            return "An unexpected error occurred";
        }
    }
};

export const deleteAccountService = async (
    token: string,
): Promise<string | null> => {
    try {
        await axios.delete<void>(`${URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return null;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response?.data) {
                const errorData: ErrorResponse = error.response.data;
                return errorData.error;
            }
            return error.response.statusText;
        } else {
            console.log(error);
            return "An unexpected error occurred";
        }
    }
};
