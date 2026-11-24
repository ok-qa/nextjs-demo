import Link from "next/link";

import { getCurrentSession } from "@/lib/auth-session";

import styles from "./Header.module.css";
import HeaderAccountActions from "./HeaderAccountActions";

export default async function Header() {
  const session = await getCurrentSession();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>SubTracker Demo</h1>

        <nav className={styles.nav}>
          <div className={styles.navBlock}>
            <Link className={styles.link} href="/">
              Dashboard
            </Link>

            <Link className={styles.link} href="/subscriptions">
              Subscriptions
            </Link>
          </div>
          {session && <HeaderAccountActions />}
        </nav>
      </div>
    </header>
  );
}
