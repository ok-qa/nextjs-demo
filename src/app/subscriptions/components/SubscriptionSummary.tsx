import { getSubscriptionSummary } from "@/lib/subscriptions";
import styles from "../SubscriptionSummary.module.css";

export default async function SubscriptionSummary() {
  const summary = await getSubscriptionSummary();

  const monthlyCost = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(summary.monthlyCost);

  return (
    <section className={styles.summary} aria-label="Subscription summary">
      <article className={styles.card}>
        <p className={styles.label}>Total subscriptions</p>
        <p className={styles.value}>{summary.count}</p>
      </article>

      <article className={styles.card}>
        <p className={styles.label}>Estimated monthly cost</p>
        <p className={styles.value}>{monthlyCost}</p>
      </article>
    </section>
  );
}
