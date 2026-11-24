"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

type LogoutButtonProps = {
  className?: string;
  showLabel?: boolean;
};

export function LogoutButton({
  className,
  showLabel = false,
}: LogoutButtonProps) {
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
      <button
        type="button"
        className={className}
        onClick={handleLogout}
        disabled={isLoading}
        aria-label="Log out"
        title="Log out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
        </svg>
        {showLabel && <span>{isLoading ? "Logging out..." : "Log out"}</span>}
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
