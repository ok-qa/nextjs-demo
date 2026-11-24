"use client";

import Link from "next/link";
import { SubmitEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";

import styles from "./change-password.module.css";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      setErrorMessage(
        "Your new password must be between 8 and 128 characters.",
      );
      return;
    }

    setIsPending(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setErrorMessage(error.message || "Unable to change your password.");
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="currentPassword">Current password</label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="newPassword">New password</label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="confirmPassword">Confirm new password</label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
      </div>

      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}

      {success && (
        <p className={styles.success} role="status">
          Your password has been changed successfully.
        </p>
      )}

      <div className={styles.actions}>
        <Link href="/profile" className={styles.cancelLink}>
          Back to profile
        </Link>

        <button type="submit" disabled={isPending}>
          <span>{isPending ? "Updating..." : "Update password"}</span>
        </button>
      </div>
    </form>
  );
}
