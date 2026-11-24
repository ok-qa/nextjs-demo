import { requireUser } from "@/lib/auth-session";

import AvatarUpload from "./AvatarUpload";
import styles from "./profile.module.css";

export default async function ProfileCard() {
  const user = await requireUser();

  return (
    <section className={styles.card}>
      <AvatarUpload image={user.image || null} name={user.name} />

      <div className={styles.userInfo}>
        <h2>{user.name}</h2>
        <p>SubTracker member</p>
      </div>

      <div className={styles.details}>
        <div className={styles.field}>
          <span>Full name</span>
          <p>{user.name}</p>
        </div>

        <div className={styles.field}>
          <span>Email address</span>
          <p>{user.email}</p>
          <small>Email address cannot be changed.</small>
        </div>

        <div className={styles.field}>
          <span>Member since</span>
          <p>
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
