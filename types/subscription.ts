interface Subscription {
  id: number;
  plan: Plan;
  planId: number;
  customer: User;
  customerId: number;
  purchaseDateTime: Date;
  expirationDate: Date;
  status: string;
  createdAt: Date;
}
