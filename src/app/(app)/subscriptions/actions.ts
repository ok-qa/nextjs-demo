"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { createSubscriptionSchema } from "../../validation";
import { requireUser } from "@/lib/auth-session";

import {
  createSubscriptionRecord,
  updateSubscriptionRecord,
  deleteSubscriptionRecord,
} from "@/lib/subscriptions";

type FormState = {
  error: string;
  success: boolean;
};

export async function createSubscription(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();

  const name = formData.get("name");
  const price = formData.get("price");
  const billingCycle = formData.get("billingCycle");
  const nextBillingDate = formData.get("nextBillingDate");

  if (
    typeof name !== "string" ||
    typeof price !== "string" ||
    typeof billingCycle !== "string" ||
    typeof nextBillingDate !== "string"
  ) {
    return {
      error: "Invalid form data.",
      success: false,
    };
  }

  const result = createSubscriptionSchema.safeParse({
    name,
    price: Number(price),
    billingCycle,
    nextBillingDate: new Date(nextBillingDate),
  });

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Invalid form data.",
      success: false,
    };
  }

  try {
    await createSubscriptionRecord(result.data, user.id);

    updateTag("subscriptions");
    revalidatePath("/subscriptions");

    return {
      error: "",
      success: true,
    };
  } catch (error) {
    console.error("Failed to create subscription:", error);

    return {
      error: "Unable to create subscription. Please try again.",
      success: false,
    };
  }
}

export async function updateSubscription(
  id: string,
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();

  const name = formData.get("name");
  const price = formData.get("price");
  const billingCycle = formData.get("billingCycle");
  const nextBillingDate = formData.get("nextBillingDate");

  if (
    typeof name !== "string" ||
    typeof price !== "string" ||
    typeof billingCycle !== "string" ||
    typeof nextBillingDate !== "string"
  ) {
    return {
      error: "Invalid form data.",
      success: false,
    };
  }

  const result = createSubscriptionSchema.safeParse({
    name,
    price: Number(price),
    billingCycle,
    nextBillingDate: new Date(nextBillingDate),
  });

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Invalid form data.",
      success: false,
    };
  }

  try {
    await updateSubscriptionRecord(id, user.id, result.data);
  } catch (error) {
    console.error("Failed to update subscription:", error);
    return {
      error: "Unable to update subscription. It may no longer exist.",
      success: false,
    };
  }

  updateTag("subscriptions");
  revalidatePath("/subscriptions");
  revalidatePath(`/subscriptions/${id}`);

  return {
    error: "",
    success: true,
  };
}

export async function deleteSubscription(id: string) {
  const user = await requireUser();

  try {
    await deleteSubscriptionRecord(id, user.id);
  } catch (error) {
    console.error("Failed to delete subscription:", error);
    return {
      error: "Unable to delete subscription. It may no longer exist.",
    };
  }

  updateTag("subscriptions");
  revalidatePath("/subscriptions");
  redirect("/subscriptions");
}
