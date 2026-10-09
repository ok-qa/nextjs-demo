import type { Subscription } from "@/types/subscription";

type SubscriptionDatabaseRecord = {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  nextBillingDate: Date;
};

export function mapSubscription(
  subscription: SubscriptionDatabaseRecord,
): Subscription {
  return {
    id: subscription.id,
    name: subscription.name,
    price: subscription.price,
    billingCycle: subscription.billingCycle as "monthly" | "yearly" | "trial",
    nextBillingDate: subscription.nextBillingDate.toISOString().split("T")[0],
  };
}
