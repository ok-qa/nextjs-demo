import Link from "next/link";

import type { Subscription } from "@/types/subscription";
import styles from "../subscriptions.module.css";

type SubscriptionCardProps = {
  subscription: Subscription;
};

export default function SubscriptionCard({
  subscription,
}: SubscriptionCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.cardTitle}>{subscription.name}</h2>

      <p className={styles.cardText}>
        ${subscription.price} / {subscription.billingCycle}
      </p>

      <p className={styles.cardText}>
        Next billing: {subscription.nextBillingDate}
      </p>
      <Link className={styles.link} href={`/subscriptions/${subscription.id}`}>
        View details
      </Link>
    </article>
  );
}
