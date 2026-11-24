"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/LogoutButton";

import styles from "./Header.module.css";

export default function HeaderAccountActions() {
  const pathname = usePathname();

  if (pathname === "/profile") {
    return null;
  }

  return (
    <>
      <span className={styles.separator} aria-hidden="true" />

      <div className={styles.navBlock}>
        <Link
          className={styles.profileLink}
          href="/profile"
          aria-label="My profile"
          title="My profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M5 21a7 7 0 0 1 14 0" />
          </svg>
        </Link>

        <LogoutButton className={styles.logoutButton} />
      </div>
    </>
  );
}
