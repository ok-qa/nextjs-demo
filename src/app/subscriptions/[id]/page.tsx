import { getSubscriptionById } from "@/lib/subscriptions";
import { notFound } from "next/navigation";
import EditSubscriptionForm from "../components/EditSubscriptionForm";

import styles from "../subscriptions.module.css";

type SubscriptionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SubscriptionPage({
  params,
}: SubscriptionPageProps) {
  const { id } = await params;

  const subscription = await getSubscriptionById(id);
  if (!subscription) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{subscription.name}</h1>

      <EditSubscriptionForm subscription={subscription} />
    </main>
  );
}
