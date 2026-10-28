import { Suspense } from "react";
import SubscriptionSearch from "./components/SubscriptionSearch";
import { SubscriptionForm } from "./components/SubscriptionForm";
import SubscriptionList from "./components/SubscriptionList";
import SubscriptionListFallback from "./components/SubscriptionListFallback";

import styles from "./subscriptions.module.css";
import SubscriptionSummaryFallback from "./components/SubscriptionSummaryFallback";
import SubscriptionSummary from "./components/SubscriptionSummary";

type SubscriptionsPageProps = {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
};

export default function SubscriptionsPage({
  searchParams,
}: SubscriptionsPageProps) {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Subscriptions</h1>

      <SubscriptionForm />

      <SubscriptionSearch />

      <Suspense fallback={<SubscriptionSummaryFallback />}>
        <SubscriptionSummary />
      </Suspense>

      <Suspense fallback={<SubscriptionListFallback />}>
        <SubscriptionList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
