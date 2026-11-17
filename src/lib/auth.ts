import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";

import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,

    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail(user.email, url).catch((error) => {
        console.error("Password reset email delivery failed:", error);
      });
    },

    resetPasswordTokenExpiresIn: 60 * 60,

    revokeSessionsOnPasswordReset: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
