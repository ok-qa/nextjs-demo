import "dotenv/config";

import { PrismaClient, BillingCycle } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.subscription.deleteMany();

  await prisma.subscription.createMany({
    data: [
      {
        name: "Netflix",
        price: 22.99,
        billingCycle: BillingCycle.monthly,
        nextBillingDate: new Date("2026-10-05"),
      },
      {
        name: "Spotify",
        price: 11.99,
        billingCycle: BillingCycle.monthly,
        nextBillingDate: new Date("2026-10-12"),
      },
      {
        name: "Disney+",
        price: 15.99,
        billingCycle: BillingCycle.yearly,
        nextBillingDate: new Date("2027-09-20"),
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
