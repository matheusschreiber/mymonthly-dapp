export type ServiceType = {
    name: string;
    description: string;
    subscriptions: { user: string;
        tokenId: string;
        price: number;
        duration: number;
        startDate: number;
        endDate: number;
    }[];
    isActive: boolean;
    metadata?: {
        subscribers?: {
            ongoing: number;
            expired: number;
            canceled: number;
        }
    }
}

export type SubscriptionType = {
    user: string;
    tokenId: string;
    price: number;
    duration: number;
    startDate: number;
    endDate: number;
}