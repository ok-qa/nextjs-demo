import Link from "next/link";
import styles from "./layout.module.css";

export default function SubscriptionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className={styles.wrapper}>
        <nav className={styles.nav}>
          <Link className={styles.link} href="/subscriptions">
            All
          </Link>

          {" | "}

          <Link className={styles.link} href="/subscriptions?status=active">
            Active
          </Link>

          {" | "}

          <Link className={styles.link} href="/subscriptions?status=expiring">
            Expiring Soon
          </Link>
        </nav>
      </div>

      {children}
    </section>
  );
}
