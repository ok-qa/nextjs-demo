"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Subscription page error:", error);
  }, [error]);

  return (
    <main>
      <h1>Something went wrong</h1>

      <p> We could not load this page. Please try again.</p>

      <button onClick={reset}>Try again</button>
    </main>
  );
}
