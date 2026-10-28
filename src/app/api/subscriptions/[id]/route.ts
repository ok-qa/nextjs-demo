import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  deleteSubscriptionRecord,
  getSubscriptionById,
  updateSubscriptionRecord,
} from "@/lib/subscriptions";
import { updateSubscriptionSchema } from "@/app/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const subscription = await getSubscriptionById(id);

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(subscription, { status: 200 });
  } catch (error) {
    console.error("[GET /api/subscriptions/[id]]", error);

    return NextResponse.json(
      { error: "Unable to fetch subscription." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const existing = await getSubscriptionById(id);

    if (!existing) {
      return NextResponse.json(
        { error: "Subscription not found." },
        { status: 404 },
      );
    }

    const body = await request.json();

    const result = updateSubscriptionSchema.safeParse({
      ...body,
      ...(body.price !== undefined && {
        price: Number(body.price),
      }),
      ...(typeof body.nextBillingDate === "string" && {
        nextBillingDate: new Date(body.nextBillingDate),
      }),
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

    const updatedData = {
      name: result.data.name ?? existing.name,
      price: result.data.price ?? existing.price,
      billingCycle: result.data.billingCycle ?? existing.billingCycle,
      nextBillingDate: new Date(
        result.data.nextBillingDate ?? existing.nextBillingDate,
      ),
    };

    const updated = await updateSubscriptionRecord(id, updatedData);

    revalidateTag("subscriptions", "max");

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    console.error("[PATCH /api/subscriptions/[id]]", error);

    return NextResponse.json(
      { error: "Unable to update subscription." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const existing = await getSubscriptionById(id);

    if (!existing) {
      return NextResponse.json(
        { error: "Subscription not found." },
        { status: 404 },
      );
    }

    await deleteSubscriptionRecord(id);

    revalidateTag("subscriptions", "max");

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/subscriptions/[id]]", error);

    return NextResponse.json(
      { error: "Unable to delete subscription." },
      { status: 500 },
    );
  }
}
