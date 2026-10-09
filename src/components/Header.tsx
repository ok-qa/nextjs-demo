/* eslint-disable @next/next/no-html-link-for-pages */
// export default function Header() {
//   return (
//     <header>
//       <h1>SubTracker Demo</h1>

//       <nav>
//         <a href="/">Dashboard</a>
//         {" | "}
//         <a href="/subscriptions">Subscriptions</a>
//       </nav>
//     </header>
//   );
// }

import Link from "next/link";

import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>SubTracker Demo</h1>

        <nav className={styles.nav}>
          <Link className={styles.link} href="/">
            Dashboard
          </Link>

          <Link className={styles.link} href="/subscriptions">
            Subscriptions
          </Link>
        </nav>
      </div>
    </header>
  );
}
