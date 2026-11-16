import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { Prisma } from "@/generated/prisma/client";
import { getCurrentSession } from "@/lib/auth-session";

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
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const subscription = await getSubscriptionById(id, session.user.id);

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
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params;

    const existing = await getSubscriptionById(id, userId);

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

    const updated = await updateSubscriptionRecord(id, userId, updatedData);

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
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await deleteSubscriptionRecord(id, session.user.id);

    revalidateTag("subscriptions", "max");

    return NextResponse.json(
      { message: "Subscription deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }
    console.error("[DELETE /api/subscriptions/[id]]", error);

    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 },
    );
  }
}
