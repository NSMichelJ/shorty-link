import { z } from "astro:schema";

export const LinkSchema = z.object({
  originalUrl: z.string().url(),
  slug: z.optional(z.string()),
  expiresAt: z.optional(z.string()),
});

export const UpdateLinkSchema = z.object({
  id: z.string(),
  originalUrl: z.string().url(),
  slug: z.string(),
  expiresAt: z.optional(z.string()),
});
