import axios from "axios"

const URL = "http://localhost:8080"

interface ErrorResponse {
    error: string;
}

export interface FollowingResponse {
    id: string,
    email: string,
    username: string,
}

export const serviceGetFollowings = async (
    token: string,
): Promise<[FollowingResponse[] | null, string | null]> => {
    try {
        const response = await axios.get<FollowingResponse[]>(
            `${URL}/follow`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return [response.data, null]
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorData: ErrorResponse = error.response.data
            return [null, errorData.error]
        } else {
            console.log(error)
            return [null, 'An unexpected error occurred']
        }
    }
}

export const serviceFollow = async (
    token: string,
    userId: number,
): Promise<string | null> => {
    try {
        await axios.post<void>(
            `${URL}/follow/${userId}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return null
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorData: ErrorResponse = error.response.data
            return errorData.error
        } else {
            console.log(error)
            return 'An unexpected error occurred'
        }
    }
}

export const serviceUnfollow = async (
    token: string,
    userId: number,
): Promise<string | null> => {
    try {
        await axios.delete<void>(
            `${URL}/follow/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return null
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorData: ErrorResponse = error.response.data
            return errorData.error
        } else {
            console.log(error)
            return 'An unexpected error occurred'
        }
    }
}