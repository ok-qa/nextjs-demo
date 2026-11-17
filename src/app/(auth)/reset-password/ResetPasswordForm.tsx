"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type SubmitEvent,useState } from "react";

import { authClient } from "@/lib/auth-client";

import styles from "../auth.module.css";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const invalidToken = searchParams.get("error") === "INVALID_TOKEN";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!token || invalidToken) {
      setError("This password reset link is invalid or has expired.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("Password must be between 8 and 128 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setError(
          "Unable to reset your password. Your link may have expired. Please request a new one.",
        );
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandName}>SubTracker</span>
          <p className={styles.tagline}>Manage your subscriptions</p>
        </div>

        {success ? (
          <>
            <h1 className={styles.heading}>Password updated!</h1>

            <p className={styles.description}>
              Your password has been successfully changed. You can now log in
              using your new password.
            </p>

            <Link className={styles.submitButton} href="/login">
              Go to login
            </Link>
          </>
        ) : (
          <>
            <h1 className={styles.heading}>Reset your password</h1>

            <p className={styles.description}>
              Choose a new password for your SubTracker account.
            </p>

            {invalidToken || !token ? (
              <>
                <p className={styles.error} role="alert">
                  This password reset link is invalid or has expired.
                </p>

                <Link className={styles.link} href="/forgot-password">
                  Request a new reset link
                </Link>
              </>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="password">
                    New password
                  </label>

                  <input
                    className={styles.input}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="confirmPassword">
                    Confirm new password
                  </label>

                  <input
                    className={styles.input}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                {error && (
                  <p className={styles.error} role="alert">
                    {error}
                  </p>
                )}

                <button
                  className={styles.submitButton}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating password..." : "Update password"}
                </button>
              </form>
            )}
          </>
        )}
      </section>
    </main>
  );
}
