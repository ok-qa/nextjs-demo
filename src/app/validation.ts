import { z } from "zod";
import { BillingCycle } from "@/generated/prisma/enums";

export const createSubscriptionSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),

  price: z
    .number()
    .finite("Price must be a valid number.")
    .nonnegative("Price cannot be negative."),

  billingCycle: z.enum(BillingCycle),

  nextBillingDate: z.date({
    error: "Next billing date must be a valid date.",
  }),
});
