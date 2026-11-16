"use client";

import { deleteSubscription } from "../actions";

type DeleteSubscriptionButtonProps = {
  id: string;
};

export default function DeleteSubscriptionButton({
  id,
}: DeleteSubscriptionButtonProps) {
  const deleteWithId = deleteSubscription.bind(null, id);

  return (
    <form
      action={async () => {
        const confirmed = window.confirm(
          "Are you sure you want to delete this subscription?",
        );

        if (confirmed) {
          await deleteWithId();
        }
      }}
    >
      <button
        type="submit"
        aria-label="Delete subscription"
        title="Delete subscription"
      >
        {/* Replace with a trash icon */}
        🗑
      </button>
    </form>
  );
}
