export type SubscriptionType = {
    user: string;
    tokenId: number;
    price: number;
    duration: number;
    startDate: number;
    endDate: number;
    serviceAddress?: string;
    serviceName?: string;
}

export type ServiceType = {
    address: string;
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

