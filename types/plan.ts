interface Plan {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    duration: number;
    benefits: string[];
    subscriptions: Subscription[]
}