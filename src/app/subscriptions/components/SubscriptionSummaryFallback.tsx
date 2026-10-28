import styles from "../SubscriptionSummary.module.css";

export default function SubscriptionSummaryFallback() {
  return (
    <section
      className={styles.summary}
      aria-label="Loading subscription summary"
      aria-busy="true"
    >
      <article className={styles.card}>
        <p className={styles.label}>Total subscriptions</p>
        <p className={styles.value}>—</p>
      </article>

      <article className={styles.card}>
        <p className={styles.label}>Estimated monthly cost</p>
        <p className={styles.value}>—</p>
      </article>
    </section>
  );
}
