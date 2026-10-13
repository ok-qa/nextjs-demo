import { BillingCycle } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { mapSubscription } from "./mappers/subscription";
import { prisma } from "./prisma";

type SubscriptionStatus = "all" | "active" | "expiring";
type SubscriptionFilters = {
  status?: SubscriptionStatus;
  search?: string;
};

export async function getSubscriptions({
  status = "all",
  search = "",
}: SubscriptionFilters = {}) {
  const now = new Date();

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  const where: Prisma.SubscriptionWhereInput = {};

  if (search) {
    where.name = {
      contains: search,
    };
  }

  if (status === "active") {
    where.nextBillingDate = {
      gt: now,
    };
  } else if (status === "expiring") {
    where.nextBillingDate = {
      gt: now,
      lte: thirtyDaysFromNow,
    };
  }

  const subscriptions = await prisma.subscription.findMany({
    where,
    orderBy: {
      nextBillingDate: "asc",
    },
  });

  return subscriptions.map(mapSubscription);
}

export async function getSubscriptionById(id: string) {
  const subscription = await prisma.subscription.findUnique({
    where: {
      id,
    },
  });

  return subscription ? mapSubscription(subscription) : null;
}

export async function createSubscriptionRecord(data: {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  nextBillingDate: Date;
}) {
  return prisma.subscription.create({
    data,
  });
}

export async function updateSubscriptionRecord(
  id: string,
  data: {
    name: string;
    price: number;
    billingCycle: BillingCycle;
    nextBillingDate: Date;
  },
) {
  return prisma.subscription.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteSubscriptionRecord(id: string) {
  return prisma.subscription.delete({
    where: {
      id,
    },
  });
}
