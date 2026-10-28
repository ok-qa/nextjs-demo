import { NextResponse } from "next/server";
import {
  createSubscriptionRecord,
  getSubscriptions,
} from "@/lib/subscriptions";
import { revalidateTag } from "next/cache";
import { createSubscriptionSchema } from "@/app/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search") ?? "";

    console.log("[API] Received status:", status);

    if (status !== null && !["all", "active", "expiring"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Use all, active, or expiring." },
        { status: 400 },
      );
    }

    const subscriptions = await getSubscriptions({
      status: status === "active" || status === "expiring" ? status : "all",
      search,
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("[GET /api/subscriptions]", error);

    return NextResponse.json(
      { error: "Unable to fetch subscriptions." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = createSubscriptionSchema.safeParse({
      ...body,
      price: Number(body.price),
      nextBillingDate:
        typeof body.nextBillingDate === "string"
          ? new Date(body.nextBillingDate)
          : body.nextBillingDate,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error.issues[0]?.message ?? "Invalid subscription data.",
        },
        { status: 400 },
      );
    }

    const subscription = await createSubscriptionRecord(result.data);

    revalidateTag("subscriptions", "max");

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    console.error("[POST /api/subscriptions]", error);

    return NextResponse.json(
      { error: "Unable to create subscription." },
      { status: 500 },
    );
  }
}
