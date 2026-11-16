import Link from "next/link";

import type { Subscription } from "@/types/subscription";
import DeleteSubscriptionButton from "./DeleteSubscriptionButton";

import styles from "../subscriptions.module.css";

type SubscriptionCardProps = {
  subscription: Subscription;
};

export default function SubscriptionCard({
  subscription,
}: SubscriptionCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{subscription.name}</h2>
        <div className={styles.actions}>
          <Link
            className={`${styles.iconButton} ${styles["mt-0"]}`}
            href={`/subscriptions/${subscription.id}`}
            aria-label={`Edit ${subscription.name}`}
            title="Edit subscription"
          >
            ✎
          </Link>
          <DeleteSubscriptionButton id={subscription.id} />
        </div>
      </div>

      <p className={styles.cardText}>
        ${subscription.price} / {subscription.billingCycle}
      </p>

      <p className={styles.cardText}>
        Next billing: {subscription.nextBillingDate}
      </p>
    </article>
  );
}
