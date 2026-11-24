import Link from "next/link";
import { Suspense } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";

import ProfileCardFallback from "./change-password/ProfileCardFallback";
import styles from "./profile.module.css";
import ProfileCard from "./ProfileCard";

export default async function ProfilePage() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information.</p>
        </div>
        <LogoutButton className={styles.logoutButton} showLabel />
      </div>

      <Suspense fallback={<ProfileCardFallback />}>
        <ProfileCard />
      </Suspense>

      <section className={styles.securityCard}>
        <div className={styles.securityItem}>
          <div>
            <h3>Password</h3>
            <p>Change your password to keep your account secure.</p>
          </div>

          <Link href="/profile/change-password" className={styles.actionLink}>
            Change password
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
