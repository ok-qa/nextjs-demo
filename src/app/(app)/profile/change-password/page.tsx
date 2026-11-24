import { requireUser } from "@/lib/auth-session";

import styles from "./change-password.module.css";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ChangePasswordPage() {
  await requireUser();

  return (
    <main className={styles.page}>
      <h1>Change password</h1>
      <p>Choose a new password for your account.</p>

      <ChangePasswordForm />
    </main>
  );
}
