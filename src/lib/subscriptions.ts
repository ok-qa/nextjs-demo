import { cacheLife, cacheTag } from "next/cache";
import { BillingCycle } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { mapSubscription } from "./mappers/subscription";
import { prisma } from "./prisma";

type SubscriptionStatus = "all" | "active" | "expiring";
type SubscriptionFilters = {
  userId: string;
  status?: SubscriptionStatus;
  search?: string;
};
type SubscriptionData = {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  nextBillingDate: Date;
};

export async function getSubscriptions({
  userId,
  status = "all",
  search = "",
}: SubscriptionFilters) {
  "use cache";

  // Cache results for minutes.
  cacheLife("minutes");

  // Give all subscription-list variants a shared invalidation tag.
  cacheTag("subscriptions");

  // uncomment to test fallback UI on the Subscriptions page
  // await new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(1);
  //   }, 10000);
  // });

  const now = new Date();

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  const where: Prisma.SubscriptionWhereInput = { userId };

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

export async function getSubscriptionById(id: string, userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: {
      id,
      userId,
    },
  });

  return subscription ? mapSubscription(subscription) : null;
}

export async function createSubscriptionRecord(
  data: SubscriptionData,
  userId: string,
) {
  return prisma.subscription.create({
    data: { ...data, userId },
  });
}

export async function updateSubscriptionRecord(
  id: string,
  userId: string,
  data: SubscriptionData,
) {
  return prisma.subscription.update({
    where: {
      id,
      userId,
    },
    data,
  });
}

export async function deleteSubscriptionRecord(id: string, userId: string) {
  return prisma.subscription.delete({
    where: {
      id,
      userId,
    },
  });
}

export async function getSubscriptionSummary(userId: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag("subscriptions");

  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId,
    },
    select: {
      price: true,
      billingCycle: true,
    },
  });

  const monthlyCost = subscriptions.reduce((total, subscription) => {
    const price = Number(subscription.price);

    if (subscription.billingCycle === "monthly") {
      return total + price;
    }

    if (subscription.billingCycle === "yearly") {
      return total + price / 12;
    }

    // Trial subscriptions are excluded from estimated monthly cost.
    return total;
  }, 0);

  return {
    count: subscriptions.length,
    monthlyCost,
  };
}
