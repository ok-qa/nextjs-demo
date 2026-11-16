"use client";

import { useActionState } from "react";
import { createSubscription } from "../actions";
import styles from "../subscriptions.module.css";

const initialState = {
  error: "",
  success: false,
};

export function SubscriptionForm() {
  const [state, formAction, isPending] = useActionState(
    createSubscription,
    initialState,
  );

  return (
    <form className={styles.form} action={formAction}>
      <div>
        <h2 className={styles.formTitle}>Add subscription</h2>
        <label htmlFor="name">Name</label>

        <input id="name" name="name" type="text" required />
      </div>

      <div>
        <label htmlFor="price">Price</label>

        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label htmlFor="billingCycle">Billing cycle</label>

        <select id="billingCycle" name="billingCycle" defaultValue="monthly">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="trial">Trial</option>
        </select>
      </div>

      <div>
        <label htmlFor="nextBillingDate">Next billing date</label>

        <input
          id="nextBillingDate"
          name="nextBillingDate"
          type="date"
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
          Subscription created successfully!
        </p>
      )}

      <button className={styles.button} type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create subscription"}
      </button>
    </form>
  );
}
