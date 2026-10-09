export type Subscription = {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly" | "trial";
  nextBillingDate: string;
};
