import { getSubscriptions } from "@/lib/subscriptions";
import SubscriptionCard from "./SubscriptionCard";

import styles from "../subscriptions.module.css";

type SubscriptionListProps = {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
};

export default async function SubscriptionList({
  searchParams,
}: SubscriptionListProps) {
  const { status, search } = await searchParams;

  const subscriptions = await getSubscriptions({
    status: status === "active" || status === "expiring" ? status : "all",
    search,
  });

  return (
    <div className={styles.list}>
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
}
