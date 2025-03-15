export type SubscriptionType = {
    user: string;
    tokenId: string;
    price: number;
    duration: number;
    startDate: number;
    endDate: number;
    service?: string;
}

export type ServiceType = {
    name: string;
    description: string;
    subscriptions: SubscriptionType[];
    isActive: boolean;
    metadata?: {
        subscribers?: {
            ongoing: number;
            expired: number;
            canceled: number;
        },
    }
}

