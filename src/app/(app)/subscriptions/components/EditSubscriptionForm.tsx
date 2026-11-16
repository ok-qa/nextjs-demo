"use client";

import { useActionState } from "react";

import { updateSubscription } from "../actions";
import type { Subscription } from "@/types/subscription";
import styles from "../subscriptions.module.css";

type EditSubscriptionFormProps = {
  subscription: Subscription;
};

export default function EditSubscriptionForm({
  subscription,
}: EditSubscriptionFormProps) {
  const updateSubscriptionWithId = updateSubscription.bind(
    null,
    subscription.id,
  );

  const [state, formAction, isPending] = useActionState(
    updateSubscriptionWithId,
    {
      error: "",
      success: false,
    },
  );

  return (
    <form className={styles.form} action={formAction}>
      <h2 className={styles.formTitle}>Edit subscription</h2>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input
          className={styles.input}
          id="name"
          name="name"
          type="text"
          defaultValue={subscription.name}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="price">
          Price
        </label>
        <input
          className={styles.input}
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={subscription.price}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="billingCycle">
          Billing cycle
        </label>
        <select
          key={subscription.billingCycle}
          className={styles.select}
          id="billingCycle"
          name="billingCycle"
          defaultValue={subscription.billingCycle}
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="trial">Trial</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="nextBillingDate">
          Next billing date
        </label>
        <input
          className={styles.input}
          id="nextBillingDate"
          name="nextBillingDate"
          type="date"
          defaultValue={subscription.nextBillingDate}
          required
        />
      </div>

      {state.error && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className={styles.success} role="status">
          Subscription updated successfully!
        </p>
      )}

      <button className={styles.button} type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
