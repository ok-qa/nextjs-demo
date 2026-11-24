import styles from "../profile.module.css";

export default function ProfileCardFallback() {
  return (
    <section className={styles.card}>
      <div className={styles.avatar}>
        <span>?</span>
      </div>

      <div className={styles.userInfo}>
        <div className={styles.skeletonName} />

        <p>SubTracker member</p>
      </div>

      <div className={styles.details}>
        <div className={styles.field}>
          <span>Full name</span>

          <div className={styles.skeletonText} />
        </div>

        <div className={styles.field}>
          <span>Email address</span>

          <div className={styles.skeletonText} />

          <small>Email address cannot be changed.</small>
        </div>

        <div className={styles.field}>
          <span>Member since</span>

          <div className={styles.skeletonText} />
        </div>
      </div>
    </section>
  );
}
