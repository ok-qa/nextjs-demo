"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setError(error.message || "");
        return;
      }

      router.replace("/login");
    } catch {
      setError("Unable to log out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? "Logging out..." : "Log out"}
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
