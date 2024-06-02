export type ProductDetail = {
    id: number;
    name: string;
    description: string;
    price: number;
    imageURL: string;
    discountAmount: number;
    createdAt: string;
    updatedAt: string;
    Reviews: Review[];
}

export type Review = {
    reviewID: number;
    rating: number;
    review: string;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
    UserId: number;
    ProductId: number;
    User: User;
    Threads: Thread[];
}

export type Thread = {
    threadID: number;
    content: string;
    reviewID: number;
    userID: number;
    parentThreadID: number | null;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
    User: User;
    ChildThreads: Thread[];
}

type User = {
    id: number,
    username: string
}