import { getSubscriptions } from "@/lib/subscriptions";
import SubscriptionSearch from "./components/SubscriptionSearch";
import SubscriptionCard from "./components/SubscriptionCard";
import { SubscriptionForm } from "./components/SubscriptionForm";

import styles from "./subscriptions.module.css";

type SubscriptionsPageProps = {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
};

export default async function SubscriptionsPage({
  searchParams,
}: SubscriptionsPageProps) {
  const { status, search } = await searchParams;
  const subscriptions = await getSubscriptions({
    status: status === "active" || status === "expiring" ? status : "all",
    search,
  });
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Subscriptions</h1>

      <SubscriptionForm />

      <SubscriptionSearch />

      <div className={styles.list}>
        {subscriptions.map((subscription) => (
          <SubscriptionCard key={subscription.id} subscription={subscription} />
        ))}
      </div>
    </main>
  );
}
