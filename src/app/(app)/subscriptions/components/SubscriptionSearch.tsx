"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "../subscriptions.module.css";

export default function SubscriptionSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchParamsString = searchParams.toString();
  const search = searchParams.get("search") ?? "";

  const [input, setInput] = useState(search);
  // const normalizedInput = input.trim();

  useEffect(() => {
    if (input === search) {
      return;
    }
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsString);

      if (input) {
        params.set("search", input);
      } else {
        params.delete("search");
      }
      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(url);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [input, search, searchParamsString, pathname, router]);

  return (
    <div className={styles.search}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search subscriptions..."
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
    </div>
  );
}
