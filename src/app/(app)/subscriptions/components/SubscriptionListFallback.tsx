import styles from "../loading.module.css";

export default function SubscriptionListFallback() {
  return (
    <div className={styles.list}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div className={styles.card} key={index}>
          <div className={`${styles.line} ${styles.lineWide}`} />
          <div className={`${styles.line} ${styles.lineMedium}`} />
          <div className={`${styles.line} ${styles.lineShort}`} />
        </div>
      ))}
    </div>
  );
}
