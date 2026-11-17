"use client";

import Link from "next/link";
import { SubmitEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";

import styles from "../auth.module.css";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError("Unable to process your request. Please try again.");
        return;
      }

      setMessage(
        "If an account exists with this email, you will receive a password reset link shortly.",
      );
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

        <h1 className={styles.heading}>Forgot your password?</h1>

        <p className={styles.description}>
          Enter the email address associated with your account. We&apos;ll send
          you a link to reset your password.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email address
            </label>

            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          {message && <p role="status">{message}</p>}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className={styles.footer}>
          Remember your password?{" "}
          <Link className={styles.link} href="/login">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
