import { cacheLife, cacheTag } from "next/cache";
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

  console.log("[getSubscriptions] Query started", {
    status,
    search,
    time: new Date().toISOString(),
  });

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

export async function getSubscriptionSummary() {
  "use cache";

  cacheLife("minutes");
  cacheTag("subscriptions");

  const subscriptions = await prisma.subscription.findMany({
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
