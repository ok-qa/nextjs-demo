"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSubscriptionSchema } from "../validation";
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

  await createSubscriptionRecord(result.data);

  revalidatePath("/subscriptions");

  return {
    error: "",
    success: true,
  };
}

export async function updateSubscription(
  id: string,
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
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
    await updateSubscriptionRecord(id, result.data);
  } catch {
    return {
      error: "Unable to update subscription. It may no longer exist.",
      success: false,
    };
  }

  revalidatePath("/subscriptions");
  revalidatePath(`/subscriptions/${id}`);

  return {
    error: "",
    success: true,
  };
}

export async function deleteSubscription(id: string) {
  try {
    await deleteSubscriptionRecord(id);
  } catch {
    return {
      error: "Unable to delete subscription. It may no longer exist.",
    };
  }

  revalidatePath("/subscriptions");
  redirect("/subscriptions");
}
