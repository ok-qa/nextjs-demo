import { getSubscriptionById } from "@/lib/subscriptions";
import { notFound } from "next/navigation";

type SubscriptionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SubscriptionPage({
  params,
}: SubscriptionPageProps) {
  const { id } = await params;

  const subscription = await getSubscriptionById(id);
  if (!subscription) {
    notFound();
  }

  return (
    <main>
      <h1>{subscription.name}</h1>

      <p>Price: ${subscription.price}</p>

      <p>Billing cycle: {subscription.billingCycle}</p>

      <p>Next billing date: {subscription.nextBillingDate}</p>
    </main>
  );
}
