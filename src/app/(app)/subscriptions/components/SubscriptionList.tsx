import { requireUser } from "@/lib/auth-session";
import { getSubscriptions } from "@/lib/subscriptions";

import styles from "../subscriptions.module.css";
import SubscriptionCard from "./SubscriptionCard";

type SubscriptionListProps = {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
};

export default async function SubscriptionList({
  searchParams,
}: SubscriptionListProps) {
  const user = await requireUser();
  const { status, search } = await searchParams;

  const subscriptions = await getSubscriptions({
    status: status === "active" || status === "expiring" ? status : "all",
    search,
    userId: user.id,
  });

  return (
    <div className={styles.list}>
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
}
