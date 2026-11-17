import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, url: string) {
  const { error } = await resend.emails.send({
    from: "SubTracker <onboarding@resend.dev>",
    to: email,
    subject: "Reset your SubTracker password",
    html: `
      <div>
        <h1>Password reset</h1>
        <p>We received a request to reset your SubTracker password.</p>
        <p>
          <a href="${url}">Reset my password</a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Unable to send password reset email.");
  }
}
