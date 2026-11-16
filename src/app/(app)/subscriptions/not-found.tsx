import Link from "next/link";
import styles from "./not-found.module.css";
export default function SubscriptionNotFound() {
  return (
    <main className={styles.container}>
      <p className={styles.code}>404</p>

      <h1 className={styles.title}>Subscription not found</h1>

      <p className={styles.description}>
        We couldn&apos;t find the subscription you&apos;re looking for. It may
        have been deleted, or the link may be incorrect.
      </p>

      <Link href="/subscriptions" className={styles.link}>
        Back to subscriptions
      </Link>
    </main>
  );
}
