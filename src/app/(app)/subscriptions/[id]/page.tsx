import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth-session";
import { getSubscriptionById } from "@/lib/subscriptions";

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
  const user = await requireUser();
  const { id } = await params;

  const subscription = await getSubscriptionById(id, user.id);
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
