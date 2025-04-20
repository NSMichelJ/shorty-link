import { prisma } from "@/lib/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  socialProviders: {
    github: {
      clientId: `${import.meta.env.GITHUB_CLIENT_ID}`,
      clientSecret: `${import.meta.env.GITHUB_CLIENT_SECRET}`,
    },
    google: {
      clientId: `${import.meta.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${import.meta.env.GOOGLE_CLIENT_SECRET}`,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
  },
  advanced: {
    cookiePrefix: "shorty-link",
  },
});
