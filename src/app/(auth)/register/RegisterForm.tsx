"use client";

import { useRouter } from "next/navigation";
import { type SubmitEvent,useState } from "react";

import { authClient } from "@/lib/auth-client";

import styles from "../auth.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setError(
          "We couldn't complete your registration. Please check your details or try logging in.",
        );
        return;
      }

      router.push("/subscriptions");
      // router.refresh();
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
          <h1 className={styles.brandName}>SubTracker</h1>
          <p className={styles.tagline}>A clearer view of your subscriptions</p>
        </div>

        <h2 className={styles.heading}>Create your account</h2>
        <p className={styles.description}>
          Start keeping track of all your subscriptions in one place.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              placeholder="Your name"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              placeholder="At least 8 characters"
              required
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <a href="/login" className={styles.link}>
            Sign in
          </a>
        </p>
      </section>
    </main>
  );
}
