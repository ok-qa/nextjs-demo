import styles from "./loading.module.css";

export default function SubscriptionsLoading() {
  return (
    <main className={styles.container}>
      <div className={styles.title} />

      <div className={styles.description} />

      <div className={styles.list}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div className={styles.card} key={index}>
            <div className={`${styles.line} ${styles.lineWide}`} />
            <div className={`${styles.line} ${styles.lineMedium}`} />
            <div className={`${styles.line} ${styles.lineShort}`} />
          </div>
        ))}
      </div>
    </main>
  );
}
