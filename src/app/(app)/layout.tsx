import { Suspense } from "react";

import Header from "@/components/Header";
import { requireUser } from "@/lib/auth-session";

async function AuthenticatedApp({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading application...</div>}>
      <AuthenticatedApp>{children}</AuthenticatedApp>
    </Suspense>
  );
}
