import "server-only";
import { cacheLife } from "next/cache";

export async function getDashboardMessage() {
  "use cache";
  cacheLife("seconds");

  const generatedAt = new Date().toISOString();

  console.log("[SERVER] Generated cached value:", generatedAt);

  return `Welcome! This value was generated at ${generatedAt}`;
}
