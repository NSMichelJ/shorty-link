import type { SocialProvider } from "@/types/provider";
import { createAuthClient } from "better-auth/client";
export const authClient = createAuthClient();

export const socialSignIn = async (provider: SocialProvider) => {
  const data = await authClient.signIn.social({
    provider,
    callbackURL: "/dashboard",
  });
  return data;
};

export const signOut = async () => {
  const data = await authClient.signOut();
  return data;
};
